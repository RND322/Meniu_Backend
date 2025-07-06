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

// Controladores
import { ProductosController } from './controllers/productos.controller';

@Module({
  imports: [
    // Carga variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
    ProductosController, // Registro del controlador
  ],
  providers: [
    AppService,
    ProductosService, // Registro del servicio
  ],
})
export class AppModule {}
