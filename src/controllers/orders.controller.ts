import { Body, Controller, Post, HttpStatus, HttpCode, UsePipes, ValidationPipe, UseGuards, Put, Req, Param, Get } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OrdersService } from 'src/services/orders.service';
import { CreateOrderDto } from 'src/services/dto/create-order.dto';
import { OrderResponseDto } from 'src/services/dto/order-response.dto';
import { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Orden } from 'src/common/entities/orden.entity';

// Endpoint POST: Crear una Orden
@ApiTags('ordenes')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }
  @Post('Crear')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      Ejemplo1: {
        summary: 'Orden sencilla',
        value: {
          id_mesa: 2,
          id_restaurante: 1,
          notas: 'Sin picante',
          items: [
            { id_producto: 2, cantidad: 2 },
            { id_producto: 11, cantidad: 1 }
          ]
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'Orden creada exitosamente',
    type: OrderResponseDto,
    schema: {
      example: {
        id_orden: 123,
        restaurante: { id_restaurante: 2, nombre: 'La Terraza Gourmet' },
        mesa: { id_mesa: 5, numero_mesa: 12 },
        estado: 'PENDIENTE',
        fecha: '2025-07-14T17:20:30.000Z',
        hora_confirmacion: '17:20:30',
        subtotal: 361.5,
        impuestos: 54.23,
        total: 415.73,
        solicitud_pago: false,
        notas: 'Traer salsa extra',
        items: [
          {
            id_orden_item: 101,
            id_producto: 42,
            nombre_producto: 'Hamburguesa doble',
            cantidad: 3,
            precio_unitario: 120.5,
            notas: 'Sin cebolla'
          },
          {
            id_orden_item: 102,
            id_producto: 17,
            nombre_producto: 'Papas fritas',
            cantidad: 1,
            precio_unitario: 50.0
          }
        ]
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'Mesa o Producto no encontrado' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  //Endpoint PUT: Actualizar el estado de una orden Cocinero
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Cocinero')
  @Put(':id/listo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Acciones de Cocinero: Cambiar estado (Listo) (Gestion) - Uso para Cocinero' })
  @ApiParam({ name: 'id', example: 10 })
  @ApiResponse({ status: 200, description: 'Orden marcada LISTO' })
  async markReady(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ) {
    return this.ordersService.markReady(id, req.user.restaurante_id);
  }

  //Endpoint PUT: Actualizar el estado de una orden Cajero
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Cajero')
  @Put(':id/cocina-estado')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Acciones de Cajero: Cambiar estado (entregar, pagar, cancelar) - Uso para Cajero',
  })
  @ApiParam({ name: 'id', example: 10 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['entregar', 'pagar', 'cancelar'],
          example: 'entregar',
        },
      },
      required: ['action'],
    },
  })
  @ApiResponse({ status: 200, description: 'Estado de orden actualizado' })
  async cashierAction(
    @Param('id') id: number,
    @Body('action') action: 'cancelar' | 'entregar' | 'pagar',
    @Req() req: AuthRequest,
  ) {
    return this.ordersService.cashierChangeState(
      id,
      action,
      req.user.restaurante_id,
    );
  }

  //Endpoint PUT: Actualizar el estado de una orden Gerente/Administrador
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Gerente', 'Administrador')
  @Put(':id/estado')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Acciones de Cajero: Cambiar estado (PENDIENTE, LISTO, ENTREGADA, PAGADA, CANCELADA) (Gestion) - Uso para Gerente, Administrador' })
  @ApiParam({ name: 'id', example: 10 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        estado: {
          type: 'string',
          enum: ['PENDIENTE', 'LISTO', 'ENTREGADA', 'PAGADA', 'CANCELADA'],
          example: 'CANCELADA',
        },
      },
      required: ['estado'],
    },
  })
  @ApiResponse({ status: 200, description: 'Estado de orden actualizado' })
  async managerChangeState(
    @Param('id') id: number,
    @Body('estado') estado: string,
    @Req() req: AuthRequest,
  ) {
    return this.ordersService.managerChangeState(
      id,
      estado,
      req.user.restaurante_id,
    );
  }

  //Endpoint PUT: Solicitar el pago uso Clientes
  @Put(':id/solicitar-pago')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Solicitar pago de una orden - Uso de Clientes',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Pago solicitado correctamente, se refleja solicitud_pago=1',
  })
  @ApiResponse({
    status: 400,
    description:
      'Orden no está ENTREGADA o ya se solicitó el pago anteriormente',
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  async requestPayment(@Param('id') id: number) {
    return this.ordersService.requestPayment(id);
  }

  //Endpoint GET: Obtener todas las ordenes en estado Pendiente Cocinero
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Cocinero')
  @Get('pendientes')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar órdenes en estado PENDIENTE (Cocinero) (Gestion) - Uso para Cocinero' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de órdenes pendientes',
    type: [OrderResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido o sin permisos',
  })
  async getPending(@Req() req: AuthRequest): Promise<OrderResponseDto[]> {
    const restauranteId = req.user.restaurante_id;
    const orders: Orden[] =
      await this.ordersService.findPending(restauranteId);

    // Mapear entidades a DTO
    return orders.map(o => ({
      id_orden: o.id_orden,
      restaurante: {
        id_restaurante: o.restaurante.id_restaurante,
        nombre: o.restaurante.nombre,
      },
      mesa: {
        id_mesa: o.mesa.id_mesa,
        numero_mesa: o.mesa.numero_mesa,
      },
      estado: o.estado,
      fecha: o.fecha,
      hora_confirmacion: o.hora_confirmacion,
      hora_lista: o.hora_lista,
      hora_entregada: o.hora_entregada,
      subtotal: o.subtotal,
      impuestos: o.impuestos,
      total: o.total,
      solicitud_pago: !!o.solicitud_pago,
      notas: o.notas || undefined,
      items: o.items.map(item => ({
        id_orden_item: item.id_orden_item,
        id_producto: item.producto.id_producto,
        nombre_producto: item.producto.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    }));
  }

  //Endpoint GET: Obtener todas las ordenes Cajero, Gerente, Administrador
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Cajero', 'Gerente', 'Administrador')
  @Get('todas')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'Listar todas las órdenes (Gestion) - Uso para Cajero, Gerente, Administrador ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de todas las órdenes del restaurante',
    type: [OrderResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido o sin permisos',
  })
  async getAllForStaff(
    @Req() req: AuthRequest,
  ): Promise<OrderResponseDto[]> {
    const restauranteId = req.user.restaurante_id;
    const orders: Orden[] =
      await this.ordersService.findAllForStaff(restauranteId);

    // Mapear entidades a DTO
    return orders.map(o => ({
      id_orden: o.id_orden,
      restaurante: {
        id_restaurante: o.restaurante.id_restaurante,
        nombre: o.restaurante.nombre,
      },
      mesa: {
        id_mesa: o.mesa.id_mesa,
        numero_mesa: o.mesa.numero_mesa,
      },
      estado: o.estado,
      fecha: o.fecha,
      hora_confirmacion: o.hora_confirmacion,
      hora_lista: o.hora_lista,
      hora_entregada: o.hora_entregada,
      subtotal: o.subtotal,
      impuestos: o.impuestos,
      total: o.total,
      solicitud_pago: !!o.solicitud_pago,
      notas: o.notas ?? undefined,
      items: o.items.map(item => ({
        id_orden_item: item.id_orden_item,
        id_producto: item.producto.id_producto,
        nombre_producto: item.producto.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    }));
  }

  //
  private mapToDto(o: Orden): OrderResponseDto {
    return {
      id_orden: o.id_orden,
      restaurante: {
        id_restaurante: o.restaurante.id_restaurante,
        nombre: o.restaurante.nombre,
      },
      mesa: {
        id_mesa: o.mesa.id_mesa,
        numero_mesa: o.mesa.numero_mesa,
      },
      estado: o.estado,
      fecha: o.fecha,
      hora_confirmacion: o.hora_confirmacion,
      hora_lista: o.hora_lista,
      hora_entregada: o.hora_entregada,
      subtotal: o.subtotal,
      impuestos: o.impuestos,
      total: o.total,
      solicitud_pago: !!o.solicitud_pago,
      notas: o.notas ?? undefined,
      items: o.items.map(item => ({
        id_orden_item: item.id_orden_item,
        id_producto: item.producto.id_producto,
        nombre_producto: item.producto.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    };
  }
  //

  //Endpoint GET: Obtener todas los detalles de una orden Cocinero
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Cocinero')
  @Get('cocina-orden/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Ver detalle de orden PENDIENTE (Gestion) - Uso para Cocinero' })
  @ApiParam({ name: 'id', type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalle de orden pendiente',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada o no está en PENDIENTE',
  })
  async getDetailForCook(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ): Promise<OrderResponseDto> {
    const rid = req.user.restaurante_id;
    const order = await this.ordersService.findOneForCook(id, rid);
    return this.mapToDto(order);
  }

  //Endpoint GET: Obtener todas los detalles de una orden Cajero, Gerente, Administrador
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Cajero', 'Gerente', 'Administrador')
  @Get('orden/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'Ver detalle de orden (Gestion) - Uso para Cajero, Gerente, Administrador',
  })
  @ApiParam({ name: 'id', type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalle de orden',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  async getDetailForStaff(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ): Promise<OrderResponseDto> {
    const rid = req.user.restaurante_id;
    const order = await this.ordersService.findOneForStaff(id, rid);
    return this.mapToDto(order);
  }

  //Endpoint GET: Obtener todas los detalles de una orden publico
  @Get('detalles-orden/:id')
  @ApiOperation({ summary: 'Obtener detalle de orden por ID' })
  @ApiParam({ name: 'id', type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalle de la orden',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Orden no encontrada',
  })
  async findOnePublic(
    @Param('id') id: number,
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.findOnePublic(id);
    return this.mapToDto(order);
  }
}