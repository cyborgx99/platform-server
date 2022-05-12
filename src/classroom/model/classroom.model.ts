import { Field, ID, ObjectType } from '@nestjs/graphql';
import { LessonModel } from 'src/lesson/models/lesson.model';
import { User } from 'src/user/models/user.model';

@ObjectType('Classroom')
export class ClassroomModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => LessonModel)
  lesson: LessonModel;

  @Field()
  notes?: string;

  @Field(() => Date)
  createdAt: Date;
}
