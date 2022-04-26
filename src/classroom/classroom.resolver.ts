import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { PUB_SUB } from 'src/pubsub/pub-sub.module';

import { ClassroomService } from './classroom.service';

@Resolver()
export class ClassroomResolver {
  constructor(
    private readonly classroomService: ClassroomService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Mutation()
  updateClassroomNotes() {
    return 's';
  }

  @Subscription(() => String)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateNotesEditor() {
    return '12';
  }
}
