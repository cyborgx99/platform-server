import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LessonPage {
  @Field()
  lessonImageId: string;

  @Field()
  lessonContentId: string;
}

@InputType()
export class CreateLessonInput {
  @Field()
  imageId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [LessonPage], { nullable: 'items' })
  pages: LessonPage;
}
