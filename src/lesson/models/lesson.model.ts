import { Field, ID, ObjectType } from '@nestjs/graphql';

import { LessonPage } from '../dto/lesson.dto';

@ObjectType('Lesson')
export class Lesson {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [LessonPage], { nullable: 'items' })
  pages: LessonPage;

  @Field(() => Date)
  createdAt: Date;
}
