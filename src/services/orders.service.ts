import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Orden } from '../common/entities/orden.entity';
import { OrdenItem } from '../common/entities/orden-item.entity';
import { Producto } from '../common/entities/producto.entity';
import { Mesa } from '../common/entities/mesa.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Restaurante } from '../common/entities/restaurante.entity';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orden)
    private ordenRepository: Repository<Orden>,
    @InjectRepository(OrdenItem)
    private ordenItemRepository: Repository<OrdenItem>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Mesa)
    private mesaRepository: Repository<Mesa>,
    @InjectRepository(Restaurante)
    private restauranteRepository: Repository<Restaurante>,
    private eventsGateway: EventsGateway,
  ) { }

  //Creacion de una orden
  async createOrder(dto: CreateOrderDto) {
    // Validar restaurante
    const restaurante = await this.restauranteRepository.findOneBy({
      id_restaurante: dto.id_restaurante,
    });
    if (!restaurante) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    // Validar mesa
    const mesa = await this.mesaRepository.findOne({
      where: {
        id_mesa: dto.id_mesa,
        restaurante: { id_restaurante: dto.id_restaurante },
      },
    });
    if (!mesa) {
      throw new NotFoundException('Mesa no encontrada en este restaurante');
    }

    // Validar productos y armar arreglo intermedio
    const itemsWithProducts = await Promise.all(
      dto.items.map(async (item) => {
        const producto = await this.productoRepository.findOne({
          where: {
            id_producto: item.id_producto,
            restaurante: { id_restaurante: dto.id_restaurante },
          },
          relations: ['restaurante'],
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto con ID ${item.id_producto} no encontrado en este restaurante`,
          );
        }

        return {
          producto,
          cantidad: item.cantidad,
          precio_unitario: producto.precio,
          notas: item.notas ?? undefined,
        };
      }),
    );

    // Calcular subtotal, impuestos y total
    const subtotal = itemsWithProducts.reduce(
      (sum, x) => sum + x.precio_unitario * x.cantidad,
      0,
    );
    const impuestos = + (subtotal * 0.15).toFixed(2);
    const total = + (subtotal + impuestos).toFixed(2);

    // Preparar y guardar la orden (DeepPartial<Orden>)
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0]; // "HH:MM:SS"
    const orderPartial: DeepPartial<Orden> = {
      restaurante: { id_restaurante: dto.id_restaurante },
      mesa: { id_mesa: dto.id_mesa },
      estado: 'PENDIENTE',
      fecha: now,
      hora_confirmacion: timeString,
      subtotal,
      impuestos,
      total,
      solicitud_pago: false,
      notas: dto.notas ?? undefined,
    };
    const savedOrder = await this.ordenRepository.save(
      this.ordenRepository.create(orderPartial),
    );

    // Crear y guardar los items de orden (DeepPartial<OrdenItem>[])
    const itemsPartial: DeepPartial<OrdenItem>[] = itemsWithProducts.map((x) => ({
      orden: { id_orden: savedOrder.id_orden },
      producto: { id_producto: x.producto.id_producto },
      cantidad: x.cantidad,
      precio_unitario: x.precio_unitario,
      notas: x.notas,
    }));
    const createdItems = itemsPartial.map((p) =>
      this.ordenItemRepository.create(p),
    );
    await this.ordenItemRepository.save(createdItems);

    // Traer la orden completa con relaciones
    const fullOrder = await this.ordenRepository.findOne({
      where: { id_orden: savedOrder.id_orden },
      relations: ['restaurante', 'mesa', 'items', 'items.producto'],
    });

    // Notificar a través de WebSocket
    this.eventsGateway.notifyNewOrder(fullOrder);

    return fullOrder;
  }

  /** 
   * Cambiar estado orden uso para Cocinero
   * Cocinero: PENDIENTE → LISTO 
   * Fija hora_lista. 
   */
  async markReady(id: number, restauranteId: number) {
    const order = await this.ordenRepository.findOne({
      where: { id_orden: id, restaurante: { id_restaurante: restauranteId } },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.estado !== 'PENDIENTE')
      throw new BadRequestException('Solo “PENDIENTE” puede pasar a “LISTO”');

    order.estado = 'LISTO';
    order.hora_lista = new Date().toTimeString().split(' ')[0];
    await this.ordenRepository.save(order);
    this.eventsGateway.notifyOrderUpdated(order);
    return order;
  }

  /**
   * Cambiar estado orden uso para Cajero
   * Cajero: varias transiciones:
   * - PENDIENTE → CANCELADA  
   * - LISTO      → ENTREGADA  (pone hora_entregada)  
   * - ENTREGADA  → PAGADA  
   * No permite cambios si ya está PAGADA.
   */
  async cashierChangeState(
    id: number,
    action: 'cancelar' | 'entregar' | 'pagar',
    restauranteId: number,
  ) {
    const order = await this.ordenRepository.findOne({
      where: { id_orden: id, restaurante: { id_restaurante: restauranteId } },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');

    if (order.estado === 'PAGADA')
      throw new BadRequestException('Orden ya pagada; no se puede modificar');

    const nowStr = new Date().toTimeString().split(' ')[0];
    switch (action) {
      case 'cancelar':
        if (order.estado !== 'PENDIENTE')
          throw new BadRequestException(
            'Solo “PENDIENTE” puede pasar a “CANCELADA”',
          );
        order.estado = 'CANCELADA';
        break;
      case 'entregar':
        if (order.estado !== 'LISTO')
          throw new BadRequestException(
            'Solo “LISTO” puede pasar a “ENTREGADA”',
          );
        order.estado = 'ENTREGADA';
        order.hora_entregada = nowStr;
        break;
      case 'pagar':
        if (order.estado !== 'ENTREGADA')
          throw new BadRequestException(
            'Solo “ENTREGADA” puede pasar a “PAGADA”',
          );
        order.estado = 'PAGADA';
        break;
      default:
        throw new BadRequestException('Acción inválida');
    }

    await this.ordenRepository.save(order);
    this.eventsGateway.notifyOrderUpdated(order);
    return order;
  }

  /**
   * Cambiar estado orden uso para Gerente/Administrador
   * Gerente/Admin: puede cambiar a cualquier estado sin restricciones.
   * Si pasa a LISTO/ENTREGADA, también actualiza su timestamp.
   */
  async managerChangeState(
    id: number,
    newState: string,
    restauranteId: number,
  ) {
    const order = await this.ordenRepository.findOne({
      where: { id_orden: id, restaurante: { id_restaurante: restauranteId } },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');

    order.estado = newState;
    const nowStr = new Date().toTimeString().split(' ')[0];
    if (newState === 'LISTO') order.hora_lista = nowStr;
    if (newState === 'ENTREGADA') order.hora_entregada = nowStr;

    await this.ordenRepository.save(order);
    this.eventsGateway.notifyOrderUpdated(order);
    return order;
  }

  /**
  * Solicitar el pago de una orden pública:
  * - Solo si estado === 'ENTREGADA'
  * - Solo si solicitud_pago === false
  */
  async requestPayment(id_orden: number): Promise<Orden> {
    // Traer la orden con restaurante 
    const order = await this.ordenRepository.findOne({
      where: { id_orden },
      relations: ['restaurante'],
    });
    if (!order) {
      throw new NotFoundException(`Orden ${id_orden} no encontrada`);
    }

    // Validar el estado
    if (order.estado !== 'ENTREGADA') {
      throw new BadRequestException(
        `Solo las órdenes con estado "ENTREGADA" pueden solicitar pago`,
      );
    }

    // Validar que aún no se haya solicitado
    if (order.solicitud_pago) {
      throw new BadRequestException(`Ya se solicitó el pago de esta orden`);
    }

    // Marcar solicitud_pago = true y guardar
    order.solicitud_pago = true;
    const saved = await this.ordenRepository.save(order);

    // Notificar a todos los paneles en tiempo real
    this.eventsGateway.notifyOrderUpdated(saved);

    return saved;
  }

  // Traer todas las ordenes en estado PENDIENTE
  async findPending(restauranteId: number): Promise<Orden[]> {
    return this.ordenRepository.find({
      where: {
        estado: 'PENDIENTE',
        restaurante: { id_restaurante: restauranteId },
      },
      relations: ['mesa', 'items', 'items.producto'],
      order: { fecha: 'ASC' },
    });
  }
  // Traer todas las ordenes en estado PENDIENTE
  async findAllForStaff(restauranteId: number): Promise<Orden[]> {
    // Verificar que al menos exista una orden, opcional
    // const count = await this.ordenRepository.count({ where: { restaurante: { id_restaurante: restauranteId } } });
    // if (!count) throw new NotFoundException('No hay órdenes para este restaurante');

    return this.ordenRepository.find({
      where: { restaurante: { id_restaurante: restauranteId } },
      relations: ['restaurante', 'mesa', 'items', 'items.producto'],
      order: { fecha: 'DESC' },
    });
  }

  //Obtener detalles de una orden Cocinero
  async findOneForCook(id: number, restauranteId: number): Promise<Orden> {
    const o = await this.ordenRepository.findOne({
      where: {
        id_orden: id,
        estado: 'PENDIENTE',
        restaurante: { id_restaurante: restauranteId },
      },
      relations: ['restaurante', 'mesa', 'items', 'items.producto'],
    });
    if (!o) throw new NotFoundException('Orden no encontrada o no PENDIENTE');
    return o;
  }

  //Obtener detalles de una orden Cajero, Administrador/Gerente
  async findOneForStaff(id: number, restauranteId: number): Promise<Orden> {
    const o = await this.ordenRepository.findOne({
      where: {
        id_orden: id,
        restaurante: { id_restaurante: restauranteId },
      },
      relations: ['restaurante', 'mesa', 'items', 'items.producto'],
    });
    if (!o) throw new NotFoundException('Orden no encontrada');
    return o;
  }
}
