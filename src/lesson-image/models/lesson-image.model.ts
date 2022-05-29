import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractModel } from 'src/common/models/abstract.model';
import { LessonModel } from 'src/lesson/models/lesson.model';

@ObjectType('LessonImage')
export class LessonImageModel extends AbstractModel {
  @Field(() => String)
  title: string;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  publicId?: string;

  @Field(() => LessonModel, { nullable: true })
  lesson?: LessonModel;
}
