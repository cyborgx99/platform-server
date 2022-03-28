import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLessonInput {
  @Field()
  imageId: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  content: string;
}
