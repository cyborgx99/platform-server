import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType('LessonImage')
@InputType('LessonImageInput')
export class LessonImage {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  url: string;

  @Field(() => String)
  baseImageId: string;
}

@ObjectType({ description: 'Lesson' })
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
