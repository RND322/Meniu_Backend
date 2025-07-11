import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Módulos
import { AuthModule } from './auth/auth.module';

//Entidades
import { Rol } from './common/entities/rol.entity';
import { Usuario } from './common/entities/usuario.entity';
import { Persona } from './common/entities/persona.entity';
import { Email } from './common/entities/email.entity';
import { Restaurante } from './common/entities/restaurante.entity';
import { Mesa } from './common/entities/mesa.entity';
import { CategoriaProducto } from './common/entities/categoria-producto.entity';
import { SubcategoriaProducto } from './common/entities/subcategoria-producto.entity';
import { Producto } from './common/entities/producto.entity';
import { Orden } from './common/entities/orden.entity';
import { OrdenItem } from './common/entities/orden-item.entity';
import { Plan } from './common/entities/plan.entity';
import { MetodoPago } from './common/entities/metodo-pago.entity';
import { Suscripcion } from './common/entities/suscripcion.entity';

// Servicios
import { ProductosService } from './services/productos.service';
import { PersonasService } from './services/personas.service';
import { UsuariosService } from './services/usuarios.service';
import { MesasService } from './services/mesas.service';
import { PlanesService } from './services/planes.service';
import { RegisterService } from './services/register.service';

import { LocalStorageService } from './common/services/local-storage.service';
//import { AzureBlobStorageService } from './common/services/azure-blob-storage.service';

// Controladores
import { ProductosController } from './controllers/productos.controller';
import { PersonasController } from './controllers/personas.controller';
import { UsuariosController } from './controllers/usuarios.controller';
import { MesasController } from './controllers/mesas.controller';
import { PlanesController } from './controllers/planes.controller';
import { RegisterController } from './controllers/register.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    // Carga variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),


    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),

    // Módulos externos
    AuthModule,

    // Conexión a la BD con TypeORM
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE'),
        logging: false,
      }),
      inject: [ConfigService],
    }),

    // Registra todas las entidades como feature modules
    TypeOrmModule.forFeature([
      Rol,
      Usuario,
      Persona,
      Email,
      Restaurante,
      Mesa,
      CategoriaProducto,
      SubcategoriaProducto,
      Producto,
      Orden,
      OrdenItem,
      Plan,
      MetodoPago,
      Suscripcion
    ]),
  ],
  controllers: [
    AppController,
    ProductosController,
    PersonasController,
    UsuariosController,
    MesasController,
    PlanesController,
    RegisterController, // Registro del controlador
  ],
  providers: [
    AppService,
    ProductosService,
    PersonasService,
    UsuariosService,
    MesasService,
    PlanesService,
    RegisterService,
    JwtStrategy, // Registro del servicio
    {
      provide: 'IStorageService',
      useClass: LocalStorageService,  //AzureBlobStorageService, En caso para Azure
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AppModule {}
