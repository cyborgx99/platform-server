import { Prisma } from '@prisma/client';

export const lessonImages: Prisma.LessonImageCreateInput[] = [
  {
    url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg',
    title: 'My Image',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/AngularJS-large.png',
    title: 'My Another Image',
  },
];
