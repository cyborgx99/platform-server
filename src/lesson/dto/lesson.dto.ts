import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('LessonPageInput')
@ObjectType()
export class LessonPage {
  @Field()
  lessonImageId: string;

  @Field()
  lessonContentId: string;
}

@InputType()
export class CreateLessonInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [LessonPage], { nullable: 'items' })
  pages: LessonPage;
}
