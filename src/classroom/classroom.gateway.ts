import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/database/prisma.service';

import {
  HandleGapData,
  HandleMultiData,
  HandleScrambledData,
  JoinRoomData,
  NotesChangeData,
  SocketEmit,
  SocketOn,
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

  @SubscribeMessage(SocketOn.joinRoom)
  async handleJoinRoom(client: Socket, data: JoinRoomData) {
    const classroom = await this.prismaService.classroom.findUnique({
      where: { id: data.roomId },
    });

    client.join(data.roomId);
    client.emit(SocketEmit.loadNotes, { notes: classroom?.notes ?? '{}' });
  }

  @SubscribeMessage(SocketOn.notesChange)
  handleNotesChange(client: Socket, data: NotesChangeData) {
    const send = { notes: data.notes };
    client.broadcast.to(data.roomId).emit(SocketEmit.receiveChanges, send);
  }

  @SubscribeMessage(SocketOn.leaveRoom)
  handleLeaveRoom(client: Socket, data) {
    client.leave(data.roomId);
  }

  @SubscribeMessage(SocketOn.handleGap)
  handleQuizImput(client: Socket, data: HandleGapData) {
    const send = { value: data.value, partId: data.partId };
    client.broadcast.to(data.roomId).emit(SocketEmit.changeInput, send);
  }

  @SubscribeMessage(SocketOn.handleScrambled)
  handleScrambled(client: Socket, data: HandleScrambledData) {
    const send = {
      type: data.type,
      part: data.part,
      sentenceId: data.sentenceId,
    };
    client.broadcast.to(data.roomId).emit(SocketEmit.scrambledResponse, send);
  }

  @SubscribeMessage(SocketOn.handleMulti)
  handleMulti(client: Socket, data: HandleMultiData) {
    const send = {
      partId: data.partId,
      value: data.value,
    };
    client.broadcast.to(data.roomId).emit(SocketEmit.multiResponse, send);
  }

  @SubscribeMessage(SocketOn.saveDocument)
  async handleSaveDocument(client: Socket, data: NotesChangeData) {
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
