import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractModel } from 'src/common/models/abstract.model';
import { LessonModel } from 'src/lesson/models/lesson.model';
import { User } from 'src/user/models/user.model';

@ObjectType('Classroom')
export class ClassroomModel extends AbstractModel {
  @Field()
  title: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => LessonModel)
  lesson: LessonModel;

  @Field(() => String, { nullable: true })
  notes?: string;
}
