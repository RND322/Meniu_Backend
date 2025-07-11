import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from '../common/entities/mesa.entity';
import { IStorageService } from '../common/interfaces/storage.interface';

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
}