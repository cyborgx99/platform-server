import { Type } from '@nestjs/common';
import {
  ArgsType,
  Field,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

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

export interface IPaginatedResponseType<T> {
  data: T[];
  totalCount: number;
  pages: number;
  hasMore: boolean;
}

export interface IPaginatedQueryArgsType {
  offset: number;
  limit: number;
  search?: string;
  sortOrder?: SortOrder;
}

@ArgsType()
export abstract class PaginatedQueryArgs implements IPaginatedQueryArgsType {
  @Field(() => Int)
  offset: number;

  @Field(() => Int)
  limit: number;

  @Field({ nullable: true, defaultValue: '' })
  search?: string;

  @Field(() => SortOrder, { nullable: true, defaultValue: SortOrder.asc })
  sortOrder?: SortOrder;
}

export function PaginatedResponse<T>(
  classRef: Type<T>,
): Type<IPaginatedResponseType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseType implements IPaginatedResponseType<T> {
    @Field(() => [classRef])
    data: T[];

    @Field(() => Int)
    pages: number;

    @Field(() => Int)
    totalCount: number;

    @Field()
    hasMore: boolean;
  }
  return PaginatedResponseType as Type<IPaginatedResponseType<T>>;
}
