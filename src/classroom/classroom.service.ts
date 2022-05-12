import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { Error_Codes } from 'src/app.types';
import { PrismaService } from 'src/database/prisma.service';
import { parseContentSentenceInLesson } from 'src/lesson/utils';
import { SortOrder } from 'src/lesson-image/dto/lesson-image.dto';

import {
  CreateClassroomInput,
  DeleteClassroomResponse,
  GetClassroomsResponse,
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
        studentId: data.studentId,
        lesson: {
          connect: {
            id: data.lessonId,
          },
        },
        user: {
          connect: {
            id: userId,
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
      where: { id: data.id, userId },
    });

    if (!classroom || classroom.userId !== userId) {
      throw new ApolloError(Error_Codes.CannotUpdate);
    }

    const updated = await this.prismaService.classroom.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        studentId: data.studentId,
        lesson: {
          connect: {
            id: data.lessonId,
          },
        },
        user: {
          connect: {
            id: userId,
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
    offset: number,
    limit: number,
    userId: string,
    search: string,
    sortOrder: SortOrder,
  ): Promise<GetClassroomsResponse> {
    const whereOptions: Prisma.ClassroomWhereInput = {
      OR: [
        {
          title: {
            startsWith: search,
            mode: 'insensitive',
          },
          userId,
        },
        { title: { endsWith: search, mode: 'insensitive' }, userId },
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

  async deleteClassroom(
    id: string,
    userId: string,
  ): Promise<DeleteClassroomResponse> {
    const classroom = await this.prismaService.classroom.findFirst({
      where: { id, userId },
    });

    if (!classroom || classroom.userId !== userId) {
      throw new ApolloError(Error_Codes.Unathorized);
    }

    const deleted = await this.prismaService.lesson.delete({
      where: {
        id,
      },
    });

    return {
      id: deleted.id,
    };
  }
}
