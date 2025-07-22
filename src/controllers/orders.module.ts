import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from 'src/controllers/orders.controller';
import { OrdersService } from '../services/orders.service';
import { EventsModule } from '../events/events.module';
import { Orden } from 'src/common/entities/orden.entity';
import { OrdenItem } from 'src/common/entities/orden-item.entity';
import { Producto } from 'src/common/entities/producto.entity';
import { Mesa } from 'src/common/entities/mesa.entity';
import { Restaurante } from 'src/common/entities/restaurante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orden, OrdenItem, Producto, Mesa, Restaurante]),
    EventsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
