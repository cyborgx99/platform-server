import { Field, ID, ObjectType } from '@nestjs/graphql';
import { LessonModel } from 'src/lesson/models/lesson.model';

@ObjectType()
export class LessonImage {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  publicId?: string;

  @Field(() => LessonModel, { nullable: true })
  lesson?: LessonModel;
}
