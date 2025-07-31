
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ 
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  handleConnection(client: Socket) {
    // Se esperam query params role y restauranteId
    const { role, restauranteId } = client.handshake.query as any;
    
    if (!role || !restauranteId) {
      console.log(`❌ Socket ${client.id} rechazado - faltan parámetros`);
      client.disconnect();
      return;
    }

    const room = `${role}-${restauranteId}`;
    client.join(room);
    client.emit('joined', room);
    console.log(`✅ Socket ${client.id} conectado a ${room}`);
  }

  handleDisconnect(client: Socket) {
    const { role, restauranteId } = client.handshake.query as any;
    const room = `${role}-${restauranteId}`;
    console.log(`❌ Socket ${client.id} desconectado de ${room}`);
    
    // La desconexión se maneja automáticamente por Socket.IO
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
