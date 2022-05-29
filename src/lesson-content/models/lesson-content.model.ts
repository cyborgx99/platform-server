import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { LessonSentenceType, PartType } from 'src/common/dto/common.dto';
import { AbstractModel } from 'src/common/models/abstract.model';

@ObjectType()
@InputType('LessonContentSentencePartInput')
export class LessonContentSentencePart {
  @Field(() => ID)
  id: string;

  @Field()
  part: string;

  @Field(() => PartType)
  partType: PartType;
}

@ObjectType()
@InputType('LessonContentSentenceInput')
export class LessonContentSentence {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  text?: string;

  @Field(() => [LessonContentSentencePart])
  sentenceParts?: LessonContentSentencePart[];

  @Field(() => LessonSentenceType)
  sentenceType: LessonSentenceType;
}

@ObjectType('LessonContent')
export class LessonContentModel extends AbstractModel {
  @Field()
  title: string;

  @Field(() => [LessonContentSentence])
  sentences: LessonContentSentence[];
}
