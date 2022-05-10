import { Lesson, LessonContent, LessonImage, LessonPage } from '@prisma/client';

import { LessonPageObject } from './dto/lesson.dto';
import { LessonModel } from './models/lesson.model';

export const parseContentSentenceInLessons = (
  lessons: (Lesson & {
    pages: (LessonPage & {
      id: string;
      lessonImage: LessonImage;
      lessonContent: LessonContent;
    })[];
  })[],
): LessonModel[] => {
  return lessons.map<LessonModel>((lesson) => {
    return {
      ...lesson,
      pages: lesson.pages.map<LessonPageObject>((page) => {
        return {
          ...page,
          lessonContent: {
            ...page.lessonContent,
            sentences: JSON.parse(page.lessonContent.sentences),
          },
        };
      }),
    };
  });
};
