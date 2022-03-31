import { Field, InputType } from '@nestjs/graphql';
import { LessonContentType } from '@prisma/client';

@InputType()
export class CreateLessonContentInput {
  @Field()
  sentence: string;

  @Field(() => [String])
  answers: string[];

  @Field(() => [String])
  pieces: string[];

  @Field(() => LessonContentType)
  type: LessonContentType;
}
