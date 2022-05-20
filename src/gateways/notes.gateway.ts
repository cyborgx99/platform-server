import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/database/prisma.service';

import {
  JoinRoomData,
  NotesGatewayMessages,
  SocketEmits,
  TextChangeData,
} from './notes.types';

@WebSocketGateway({
  namespace: '/notes',
  cors: {
    origin: `${process.env.CORS_ORIGIN}`,
    methods: ['GET', 'POST'],
  },
})
export class NotesGateway {
  constructor(private prismaService: PrismaService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(NotesGatewayMessages.joinRoom)
  async handleJoinRoom(client: Socket, data: JoinRoomData) {
    const classroom = await this.prismaService.classroom.findUnique({
      where: { id: data.roomId },
    });

    client.join(data.roomId);
    client.emit(SocketEmits.loadNotes, { notes: classroom?.notes ?? '{}' });
  }

  @SubscribeMessage(NotesGatewayMessages.textChange)
  handleTextChange(client: Socket, data: TextChangeData) {
    const send = { notes: data.notes };
    client.broadcast.to(data.roomId).emit(SocketEmits.receiveChanges, send);
  }

  @SubscribeMessage(NotesGatewayMessages.leaveRoom)
  handleLeaveRoom(client: Socket, data) {
    client.leave(data.roomId);
  }

  @SubscribeMessage(NotesGatewayMessages.saveDocument)
  async handleSaveDocument(client: Socket, data: TextChangeData) {
    await this.prismaService.classroom.update({
      where: {
        id: data.roomId,
      },
      data: {
        notes: data.notes,
      },
    });
  }
}
