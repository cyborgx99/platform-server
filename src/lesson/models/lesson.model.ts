import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AbstractModel } from 'src/common/models/abstract.model';
import { LessonContentModel } from 'src/lesson-content/models/lesson-content.model';
import { LessonImageModel } from 'src/lesson-image/models/lesson-image.model';

@ObjectType()
export class LessonPageObject {
  @Field(() => ID)
  id: string;

  @Field(() => LessonImageModel)
  lessonImage: LessonImageModel;

  @Field(() => LessonContentModel)
  lessonContent: LessonContentModel;
}

@ObjectType('Lesson')
export class LessonModel extends AbstractModel {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [LessonPageObject])
  pages: LessonPageObject[];
}
