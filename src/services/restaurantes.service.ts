import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurante } from '../common/entities/restaurante.entity';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { IStorageService } from '../common/interfaces/storage.interface';
import { UpdateRestauranteTextDto } from './dto/update-restaurante-text.dto';

@Injectable()
export class RestaurantesService {
    constructor(
        @InjectRepository(Restaurante)
        private readonly restauranteRepo: Repository<Restaurante>,
        @Inject('IStorageService')
        private readonly storage: IStorageService,
    ) { }

    //Actualizacion de datos de un restaurante
    async updateRestaurant(
        id: number,
        dto: UpdateRestauranteDto,
        logoFile: Express.Multer.File | undefined,
        restauranteIdFromToken: number,
    ): Promise<Restaurante> {
        const rest = await this.restauranteRepo.findOne({
            where: { id_restaurante: id },
        });
        if (!rest) {
            throw new NotFoundException(`Restaurante ${id} no encontrado`);
        }

        // Seguridad: solo el gerente/admin de su propio restaurante
        if (rest.id_restaurante !== restauranteIdFromToken) {
            throw new UnauthorizedException(
                'No puedes modificar un restaurante que no es tuyo',
            );
        }

        // Actualizar campos opcionales
        if (dto.nombre) rest.nombre = dto.nombre;
        if (dto.email) rest.email = dto.email;
        if (dto.direccion) rest.direccion = dto.direccion;
        if (dto.telefono) rest.telefono = dto.telefono;
        if (dto.descripcion) rest.descripcion = dto.descripcion;

        // Si llega un nuevo logo, se sube y se actualiza logo_url
        if (logoFile) {
            const ext = logoFile.originalname.split('.').pop();
            const filename = `logo_${Date.now()}.${ext}`;
            rest.logo_url = await this.storage.uploadFile(
                logoFile.buffer,
                filename,
                'restaurante',
            );
        }

        return this.restauranteRepo.save(rest);
    }

    //Obtener los datos de un restaurante
    async findOnePublic(id: number): Promise<Restaurante> {
        const rest = await this.restauranteRepo.findOne({
            where: { id_restaurante: id },
        });
        if (!rest) {
            throw new NotFoundException(`Restaurante ${id} no encontrado`);
        }
        return rest;
    }

    /*MODIFICACION DE METODOS */

    //Actualizacion de datos de un restaurante la imagen como texto o link
    async updateRestaurantText(
        id: number,
        dto: UpdateRestauranteTextDto,
        restauranteIdFromToken: number,
    ): Promise<Restaurante> {
        const rest = await this.restauranteRepo.findOne({
            where: { id_restaurante: id },
        });
        if (!rest) {
            throw new NotFoundException(`Restaurante ${id} no encontrado`);
        }

        if (rest.id_restaurante !== restauranteIdFromToken) {
            throw new UnauthorizedException(
                'No puedes modificar un restaurante que no es tuyo',
            );
        }

        // Campos editables
        if (dto.nombre) rest.nombre = dto.nombre;
        if (dto.email) rest.email = dto.email;
        if (dto.direccion) rest.direccion = dto.direccion;
        if (dto.telefono) rest.telefono = dto.telefono;
        if (dto.descripcion) rest.descripcion = dto.descripcion;

        // Logo como texto
        if (dto.logoUrl !== undefined) {
            if (dto.logoUrl.trim() === '') {
                throw new BadRequestException('logoUrl no puede estar vacío');
            }
            rest.logo_url = dto.logoUrl;
        }

        return this.restauranteRepo.save(rest);
    }
}
