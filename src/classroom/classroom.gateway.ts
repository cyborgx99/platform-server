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
} from './dto/clasroom.dto';

// not adding any credentials as some pages can be used by unathorized users
@WebSocketGateway({
  namespace: '/classroom',
  cors: {
    origin: `${process.env.CORS_ORIGIN}`,
    methods: ['GET', 'POST'],
  },
})
export class ClassroomGateway {
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

  @SubscribeMessage(NotesGatewayMessages.emitInput)
  handleQuizImput(client: Socket, data) {
    const send = { value: data.value, partId: data.partId };
    client.broadcast.to(data.roomId).emit(SocketEmits.changeInput, send);
  }

  @SubscribeMessage(NotesGatewayMessages.handleScrambled)
  handleScrambled(client: Socket, data) {
    const send = {
      type: data.type,
      part: data.part,
      sentenceId: data.sentenceId,
    };
    client.broadcast.to(data.roomId).emit(SocketEmits.scrambledResponse, send);
  }

  @SubscribeMessage(NotesGatewayMessages.handleMulti)
  handleMulti(client: Socket, data) {
    const send = {
      partId: data.partId,
      value: data.value,
    };
    client.broadcast.to(data.roomId).emit(SocketEmits.multiResponse, send);
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
