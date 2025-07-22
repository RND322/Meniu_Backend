
import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;

  handleConnection(client: Socket) {
    // Se esperam query params role y restauranteId
    const { role, restauranteId } = client.handshake.query as any;
    const room = `${role}-${restauranteId}`;
    client.join(room);
    client.emit('joined', room);
    console.log(`Socket ${client.id} in ${room}`);
  }

  notifyNewOrder(order: any) {
    this.server
      .to(`cocina-${order.restaurante.id_restaurante}`)
      .emit('nueva_orden', { ...order, tipo: 'COCINA' });
    this.server
      .to(`cajero-${order.restaurante.id_restaurante}`)
      .emit('nueva_orden', { ...order, tipo: 'CAJERO' });
  }

  notifyOrderUpdated(order: any) {
    const rid = order.restaurante.id_restaurante;

    this.server
      .to(`cocina-${rid}`)
      .emit('estado_orden', order);

    this.server
      .to(`cajero-${rid}`)
      .emit('estado_orden', order);

    this.server
      .to(`gerente-${rid}`)
      .emit('estado_orden', order);
    this.server
      .to(`administrador-${rid}`)
      .emit('estado_orden', order);
  }
}
