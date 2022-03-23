import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileUploadResponse {
  @Field()
  url: string;
}
