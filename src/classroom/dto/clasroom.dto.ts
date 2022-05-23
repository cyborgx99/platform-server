import {
  ArgsType,
  Field,
  ID,
  InputType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import {
  PaginatedQueryArgs,
  PaginatedResponse,
} from 'src/common/dto/common.dto';

import { ClassroomModel } from '../model/classroom.model';

@InputType()
export class CreateClassroomInput {
  @Field()
  title: string;

  @Field()
  lessonId: string;

  @Field({ nullable: true })
  studentId?: string;

  @Field({ nullable: true })
  notes?: string;
}

@InputType()
export class UpdateClassroomInput extends PartialType(CreateClassroomInput) {
  @Field(() => ID)
  id: string;
}

@ObjectType()
export class GetClassroomsResponse {
  @Field(() => [ClassroomModel])
  data: ClassroomModel[];

  @Field()
  totalCount: number;

  @Field()
  pages: number;

  @Field()
  hasMore: boolean;
}

@ObjectType()
export class PaginatedClassroomsResponse extends PaginatedResponse(
  ClassroomModel,
) {}

@ArgsType()
export class GetClassroomsQueryArgs extends PaginatedQueryArgs {}

@ObjectType()
export class DeleteClassroomResponse {
  @Field(() => ID)
  id: string;
}

@ArgsType()
export class UpdateNotesMutationArgs {
  @Field()
  classroomId: string;

  @Field()
  notes: string;
}

@ObjectType()
export class UpdateNotesMutationResponse {
  @Field()
  classroomId: string;

  @Field()
  notes: string;
}

export enum NotesGatewayMessages {
  joinRoom = 'joinRoom',
  textChange = 'textChange',
  leaveRoom = 'leaveRoom',
  saveDocument = 'saveDocument',
}

export enum SocketEmits {
  loadNotes = 'loadNotes',
  receiveChanges = 'receiveChanges',
}

export class JoinRoomData {
  roomId: string;
}

export class TextChangeData {
  roomId: string;
  notes: string;
}
