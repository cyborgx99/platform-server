import { Field, ID, ObjectType } from '@nestjs/graphql';
import { LessonImage } from 'src/lesson-image/models/lesson-image.model';

@ObjectType('Lesson')
export class Lesson {
  @Field(() => ID)
  id: number;

  @Field(() => LessonImage)
  image: LessonImage;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  content: string;

  @Field(() => Date)
  createdAt: Date;
}
