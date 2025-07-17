import { Injectable, BadRequestException, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../common/entities/mesa.entity';
import { IStorageService } from '../common/interfaces/storage.interface';
import { UpdateMesaTextDto } from './dto/update-mesa-text.dto';
import { CreateMesaTextDto } from './dto/create-mesa-text.dto';

@Injectable()
export class MesasService {
    constructor(
        @InjectRepository(Mesa)
        private readonly mesaRepository: Repository<Mesa>,
        @Inject('IStorageService')
        private readonly storageService: IStorageService,
    ) { }

    //Verficacion de una mesa
    async verificarMesaExistente(
        numeroMesa: number,
        restauranteId: number,
    ): Promise<boolean> {
        const count = await this.mesaRepository.count({
            where: {
                numero_mesa: numeroMesa,
                restaurante: { id_restaurante: restauranteId }
            },
        });
        return count > 0;
    }

    //Subir imagen de una mesa
    async subirImagenQR(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new BadRequestException('Archivo de imagen QR no proporcionado');
        }

        // Generar un nombre único para el archivo
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `qr_${Date.now()}.${fileExtension}`;

        return this.storageService.uploadFile(
            file.buffer,
            fileName,
            'mesa' // Tipo 'mesa' para guardar en la carpeta correcta
        );
    }

    //Crear una mesa
    async crearMesa(datos: {
        numero_mesa: number;
        estado_mesa: string;
        qr_code: string;
        id_restaurante: number;
    }): Promise<Mesa> {
        const nuevaMesa = this.mesaRepository.create({
            ...datos,
            restaurante: { id_restaurante: datos.id_restaurante }
        });
        return this.mesaRepository.save(nuevaMesa);
    }

    //Obtener una mesa con el restaurante
    async obtenerMesaConRestaurante(idMesa: number): Promise<Mesa | null> {
        return this.mesaRepository.findOne({
            where: { id_mesa: idMesa },
            relations: ['restaurante']
        });
    }

    //Atualizar los datos de una mesa
    async actualizarMesa(idMesa: number, datos: Partial<Mesa>): Promise<Mesa> {
        await this.mesaRepository.update(idMesa, datos);
        const updated = await this.mesaRepository.findOne({
            where: { id_mesa: idMesa },
            relations: ['restaurante']
        });
        if (!updated) throw new NotFoundException('Mesa no encontrada');
        return updated;
    }

    //Obtener todas las mesas de un restaurante
    async obtenerMesasPorRestaurante(restauranteId: number): Promise<Mesa[]> {
        return this.mesaRepository.find({
            where: { restaurante: { id_restaurante: restauranteId } },
            order: { numero_mesa: 'ASC' }, // Ordenadas por número de mesa
            select: {
                id_mesa: true,
                numero_mesa: true,
                estado_mesa: true,
                qr_code: true,
            },
        });
    }

    /*MODIFICACION DE METODOS */

    //Creacion de mesa con texto como imagen
    async crearMesaText(
        dto: CreateMesaTextDto & { id_restaurante: number },
    ): Promise<Mesa> {
        //Verificar número único:
        const existe = await this.verificarMesaExistente(dto.numero_mesa, dto.id_restaurante);
        if (existe) {
            throw new BadRequestException(`La mesa ${dto.numero_mesa} ya existe`);
        }

        //Delegar a crearMesa (que monta la entidad)
        return this.crearMesa({
            numero_mesa: dto.numero_mesa,
            estado_mesa: dto.estado_mesa,
            qr_code: dto.qr_code,
            id_restaurante: dto.id_restaurante,
        });
    }

    //Actualizacion de mesa con texto como imagen
    async actualizarMesaText(
        idMesa: number,
        dto: UpdateMesaTextDto,
        restauranteId: number,
    ): Promise<Mesa> {
        //Obtener y validar pertenencia
        const mesa = await this.obtenerMesaConRestaurante(idMesa);
        if (!mesa) {
            throw new NotFoundException(`Mesa ${idMesa} no encontrada`);
        }
        if (mesa.restaurante.id_restaurante !== restauranteId) {
            throw new ForbiddenException('No tienes permisos sobre esta mesa');
        }

        //Preparar datos a actualizar
        const datos: Partial<Mesa> = {};
        if (dto.numero_mesa != null && dto.numero_mesa !== mesa.numero_mesa) {
            const dup = await this.verificarMesaExistente(dto.numero_mesa, restauranteId);
            if (dup) {
                throw new BadRequestException(`La mesa ${dto.numero_mesa} ya existe`);
            }
            datos.numero_mesa = dto.numero_mesa;
        }
        if (dto.estado_mesa != null) {
            datos.estado_mesa = dto.estado_mesa;
        }
        if (dto.qr_code != null) {
            datos.qr_code = dto.qr_code;
        }

        //Delegar a tu método genérico de update
        return this.actualizarMesa(idMesa, datos);
    }
}