import { Field, InputType } from '@nestjs/graphql';

import { LessonImage } from '../models/lesson.model';

@InputType()
export class CreateLessonInput {
  @Field(() => LessonImage)
  image: LessonImage;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  content: string;
}
