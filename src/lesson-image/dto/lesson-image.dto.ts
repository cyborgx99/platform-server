import {
  Field,
  ID,
  InputType,
  ObjectType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';

import { LessonImage } from '../models/lesson-image.model';

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});
@InputType()
export class CreateLessonImageInput {
  @Field()
  url: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  publicId?: string;
}

@InputType()
export class DeleteLessonImageInput {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  publicId?: string;
}

@InputType()
export class UpdateLessonImageInput extends PartialType(
  CreateLessonImageInput,
) {
  @Field(() => ID)
  id: string;
}
@ObjectType()
export class GetLessonImagesResponse {
  @Field(() => [LessonImage])
  data: LessonImage[];

  @Field()
  totalCount: number;

  @Field()
  pages: number;
}

export class LessomImagesWhereOptions {
  OR: (
    | {
        title: {
          startsWith: string;
          mode: 'insensitive';
        };
      }
    | {
        title: {
          endsWith: string;
          mode: 'insensitive';
        };
      }
  )[];
}
