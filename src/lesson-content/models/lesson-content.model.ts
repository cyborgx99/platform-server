import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum LessonSentenceType {
  Text = 'Text',
  Title = 'Title',
  Gap = 'Gap',
  Multi = 'Multi',
  Scramble = 'Scramble',
}

export enum PartType {
  Gap = 'Gap',
  Regular = 'Regular',
  RightAnswer = 'RightAnswer',
  WrongAnswer = 'WrongAnswer',
}

registerEnumType(LessonSentenceType, {
  name: 'LessonSentenceType',
});

registerEnumType(PartType, {
  name: 'PartType',
});
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

  @Field(() => [LessonContentSentencePart])
  sentence: LessonContentSentencePart[];

  @Field(() => LessonSentenceType)
  sentenceType: LessonSentenceType;
}

@ObjectType()
export class LessonContent {
  @Field(() => ID)
  id: string;

  @Field(() => [LessonContentSentence])
  sentences: LessonContentSentence[];
}
