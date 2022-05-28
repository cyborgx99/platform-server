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
import { LessonContentSentencePart } from 'src/lesson-content/models/lesson-content.model';

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

export enum SocketOn {
  joinRoom = 'joinRoom',
  leaveRoom = 'leaveRoom',
  notesChange = 'notesChange',
  saveDocument = 'saveDocument',
  handleGap = 'handleGap',
  handleScrambled = 'handleScrambled',
  handleMulti = 'handleMulti',
}

export enum SocketEmit {
  loadNotes = 'loadNotes',
  receiveChanges = 'receiveChanges',
  changeInput = 'changeInput',
  scrambledResponse = 'scrambledResponse',
  multiResponse = 'multiResponse',
}

export class JoinRoomData {
  roomId: string;
}

export class NotesChangeData {
  roomId: string;
  notes: string;
}

export class HandleGapData {
  roomId: string;
  value: string;
  partId: string;
}

export class HandleScrambledData {
  type: string;
  part: LessonContentSentencePart;
  sentenceId: string;
  roomId: string;
}

export class HandleMultiData {
  partId: string;
  value: string;
  roomId: string;
}
