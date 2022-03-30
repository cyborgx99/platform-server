import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLessonInput {
  @Field()
  imageId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  content: string;
}
