import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Restaurante } from 'src/common/entities/restaurante.entity';
import { Usuario } from 'src/common/entities/usuario.entity';
import { Persona } from 'src/common/entities/persona.entity';
import { Email } from 'src/common/entities/email.entity';
import { Plan } from 'src/common/entities/plan.entity';
import { MetodoPago } from 'src/common/entities/metodo-pago.entity';
import { Suscripcion } from 'src/common/entities/suscripcion.entity';
import { Rol } from 'src/common/entities/rol.entity';
import { RegisterDto } from './dto/register.dto';
import { IStorageService } from '../common/interfaces/storage.interface';

@Injectable()
export class RegisterService {
    constructor(
        @InjectRepository(Restaurante)
        private restauranteRepository: Repository<Restaurante>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(Persona)
        private personaRepository: Repository<Persona>,
        @InjectRepository(Email)
        private emailRepository: Repository<Email>,
        @InjectRepository(Plan)
        private planRepository: Repository<Plan>,
        @InjectRepository(MetodoPago)
        private metodoPagoRepository: Repository<MetodoPago>,
        @InjectRepository(Suscripcion)
        private suscripcionRepository: Repository<Suscripcion>,
        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
        @Inject('IStorageService')
        private storageService: IStorageService,
    ) { }

    //Registro de una persona con su restaurante
    async completeRegistration(registerDto: RegisterDto, logo?: Express.Multer.File) {
        const queryRunner = this.restauranteRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Verificar si el plan existe
            const plan = await queryRunner.manager.findOne(Plan, {
                where: { id_plan: registerDto.id_plan }
            });

            if (!plan) {
                throw new BadRequestException('El plan seleccionado no existe');
            }

            // Subir logo del restaurante
            let logoUrl = '';
            if (logo) {
                const fileExtension = logo.originalname.split('.').pop();
                const fileName = `logo_${Date.now()}.${fileExtension}`;
                logoUrl = await this.storageService.uploadFile(
                    logo.buffer,
                    fileName,
                    'restaurante' // Ruta
                );
            }

            // Crear restaurante
            const restaurante = this.restauranteRepository.create({
                nombre: registerDto.nombre_restaurante,
                email: registerDto.email_restaurante,
                direccion: registerDto.direccion,
                telefono: registerDto.telefono,
                logo_url: logoUrl,
                descripcion: registerDto.descripcion,
                activo: 1
            });
            await queryRunner.manager.save(restaurante);

            // Obtener rol de Gerente
            const rolGerente = await queryRunner.manager.findOne(Rol, {
                where: { nombreRol: 'Gerente' }
            });

            if (!rolGerente) {
                throw new Error('Rol de Gerente no configurado en el sistema');
            }

            // Crear usuario (con password hasheado)
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const usuario = this.usuarioRepository.create({
                rol: rolGerente,
                restaurante: restaurante,
                nombreUsuario: registerDto.email.split('@')[0],
                password: hashedPassword,
                activo: 1
            });
            await queryRunner.manager.save(usuario);

            // Crear persona
            const persona = this.personaRepository.create({
                usuario: usuario,
                nombre: registerDto.nombre,
                apellidos: registerDto.apellidos
            });
            await queryRunner.manager.save(persona);

            // Crear email
            const email = this.emailRepository.create({
                usuario: usuario,
                email: registerDto.email
            });
            await queryRunner.manager.save(email);

            // Crear método de pago
            const metodoPago = this.metodoPagoRepository.create({
                usuario: usuario,
                nombre_propietario: registerDto.nombre_propietario_tarjeta,
                numero_tarjeta: registerDto.numero_tarjeta,
                cvv: registerDto.cvv,
                mes_expiracion: registerDto.mes_expiracion,
                anio_expiracion: registerDto.anio_expiracion,
                activo: 1
            });
            await queryRunner.manager.save(metodoPago);

            // Crear suscripción (con fechas como Date)
            const fechaInicio = new Date();
            const fechaCobro = new Date();
            fechaCobro.setDate(fechaCobro.getDate() + 30);

            const suscripcion = this.suscripcionRepository.create({
                restaurante: restaurante,
                metodoPago: metodoPago,
                plan: plan,
                fecha_inicio: fechaInicio,
                fecha_cobro: fechaCobro,
                activa: 1
            });
            await queryRunner.manager.save(suscripcion);

            await queryRunner.commitTransaction();

            return {
                success: true,
                message: 'Registro completado exitosamente',
                data: {
                    restauranteId: restaurante.id_restaurante,
                    usuarioId: usuario.id_usuario
                }
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(
                error instanceof Error ? error.message : 'Error en el registro'
            );
        } finally {
            await queryRunner.release();
        }
    }
}