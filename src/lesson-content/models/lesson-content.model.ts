import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LessonContentType } from '@prisma/client';

registerEnumType(LessonContentType, {
  name: 'LessonContentType',
});

@ObjectType()
export class LessonContent {
  @Field(() => ID)
  id: string;

  @Field()
  sentence: string;

  @Field(() => [String])
  answers: string[];

  @Field(() => [String])
  pieces: string[];

  @Field(() => LessonContentType)
  type: LessonContentType;
}
