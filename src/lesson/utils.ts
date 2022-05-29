import { Lesson, LessonContent, LessonImage, LessonPage } from '@prisma/client';

import { LessonModel, LessonPageObject } from './models/lesson.model';

export type LessonWithPages = Lesson & {
  pages: (LessonPage & {
    id: string;
    lessonImage: LessonImage;
    lessonContent: LessonContent;
  })[];
};

export const parseContentSentenceInLesson = (
  lesson: LessonWithPages,
): LessonModel => {
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
};
