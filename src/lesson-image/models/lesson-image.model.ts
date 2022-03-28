import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Lesson } from 'src/lesson/models/lesson.model';

@ObjectType()
export class LessonImage {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  publicId?: string;

  @Field(() => Lesson, { nullable: true })
  lesson?: Lesson;
}
