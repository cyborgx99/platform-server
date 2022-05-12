import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';

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
export class DeleteClassroomResponse {
  @Field(() => ID)
  id: string;
}
