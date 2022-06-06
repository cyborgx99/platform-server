import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { Error_Messages } from 'src/app.types';
import { PrismaService } from 'src/database/prisma.service';
import { parseContentSentenceInLesson } from 'src/lesson/utils';

import {
  CreateClassroomInput,
  DeleteClassroomResponse,
  GetClassroomsQueryArgs,
  PaginatedClassroomsResponse,
  UpdateClassroomInput,
} from './dto/clasroom.dto';
import { ClassroomModel } from './model/classroom.model';

@Injectable()
export class ClassroomService {
  constructor(private readonly prismaService: PrismaService) {}

  async createClassroom(
    data: CreateClassroomInput,
    userId: string,
  ): Promise<ClassroomModel> {
    const classroom = await this.prismaService.classroom.create({
      data: {
        title: data.title,
        teacherId: userId,
        lesson: {
          connect: {
            id: data.lessonId,
          },
        },
        user: {
          connect: data.studentId && {
            id: data.studentId,
          },
        },
      },
      include: {
        lesson: {
          include: {
            pages: {
              include: {
                lessonContent: true,
                lessonImage: true,
              },
            },
          },
        },
      },
    });

    const classroomWithParsedContentSentence: ClassroomModel = {
      ...classroom,
      lesson: parseContentSentenceInLesson(classroom.lesson),
    };

    return classroomWithParsedContentSentence;
  }

  async updateClassroom(
    data: UpdateClassroomInput,
    userId: string,
  ): Promise<ClassroomModel> {
    const classroom = await this.prismaService.classroom.findFirst({
      where: { id: data.id, teacherId: userId },
    });

    if (!classroom || classroom.userId !== userId) {
      throw new ApolloError(Error_Messages.CannotUpdate);
    }

    const updated = await this.prismaService.classroom.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        lesson: {
          connect: {
            id: data.lessonId,
          },
        },
        user: {
          connect: {
            id: data.studentId,
          },
        },
      },
      include: {
        lesson: {
          include: {
            pages: {
              include: {
                lessonContent: true,
                lessonImage: true,
              },
            },
          },
        },
      },
    });

    const classroomWithParsedContentSentence: ClassroomModel = {
      ...classroom,
      lesson: parseContentSentenceInLesson(updated.lesson),
    };

    return classroomWithParsedContentSentence;
  }

  async getClassrooms(
    { offset, limit, search, sortOrder }: GetClassroomsQueryArgs,
    userId: string,
  ): Promise<PaginatedClassroomsResponse> {
    const whereOptions: Prisma.ClassroomWhereInput = {
      teacherId: userId,
      OR: [
        {
          title: {
            startsWith: search,
            mode: 'insensitive',
          },
        },
        { title: { endsWith: search, mode: 'insensitive' } },
      ],
    };

    const [classrooms, totalCount] = await this.prismaService.$transaction([
      this.prismaService.classroom.findMany({
        take: limit,
        skip: offset ?? 0,
        where: whereOptions,
        orderBy: {
          title: sortOrder,
        },
        include: {
          lesson: {
            include: {
              pages: {
                include: {
                  lessonContent: true,
                  lessonImage: true,
                },
              },
            },
          },
          user: true,
        },
      }),
      this.prismaService.classroom.count({ where: whereOptions }),
    ]);

    const pages = Math.ceil(totalCount / limit);

    const hasMore = offset < totalCount && totalCount > limit;

    const classroomsWithParsedContentSentence: ClassroomModel[] =
      classrooms.map((classroom) => {
        return {
          ...classroom,
          lesson: parseContentSentenceInLesson(classroom.lesson),
        };
      });

    return {
      data: classroomsWithParsedContentSentence,
      pages,
      totalCount,
      hasMore,
    };
  }

  async getSingleClassroom(
    id: string,
    userId: string,
  ): Promise<ClassroomModel> {
    const classroom = await this.prismaService.classroom.findFirst({
      where: { id, teacherId: userId },
      include: {
        lesson: {
          include: {
            pages: {
              include: {
                lessonContent: true,
                lessonImage: true,
              },
            },
          },
        },
      },
    });

    const classroomWithParsedContentSentence: ClassroomModel = {
      ...classroom,
      lesson: parseContentSentenceInLesson(classroom.lesson),
    };
    return classroomWithParsedContentSentence;
  }

  async deleteClassroom(
    id: string,
    userId: string,
  ): Promise<DeleteClassroomResponse> {
    const classroom = await this.prismaService.classroom.findFirst({
      where: { id, teacherId: userId },
    });

    if (!classroom || classroom.teacherId !== userId) {
      throw new ApolloError(Error_Messages.Unathorized);
    }

    const deleted = await this.prismaService.classroom.delete({
      where: {
        id,
      },
    });

    return {
      id: deleted.id,
    };
  }
}
