import { Field, ID, ObjectType } from '@nestjs/graphql';

import { LessonPageObject } from '../dto/lesson.dto';

@ObjectType('Lesson')
export class LessonModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [LessonPageObject], { nullable: 'items' })
  pages: LessonPageObject[];

  @Field(() => Date)
  createdAt: Date;
}
