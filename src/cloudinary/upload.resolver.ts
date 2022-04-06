import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';

import { CloudinaryService } from './cloudinary.service';
import { FileUploadResponse } from './dto/upload.dto';

@Resolver()
export class UploadResolver {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Mutation(() => FileUploadResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<FileUploadResponse> {
    const { secure_url, public_id } = await this.cloudinaryService.uploadImage(
      file,
    );
    return { url: secure_url, publicId: public_id };
  }
}
