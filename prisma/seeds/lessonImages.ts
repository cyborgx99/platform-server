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
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg',
    title: 'Vue',
  },
  {
    url: 'https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg',
    title: 'Nestjs',
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg',
    title: 'Next js',
  },
  {
    url: 'https://raw.githubusercontent.com/reduxjs/redux/master/logo/logo.png',
    title: 'Redux',
  },
];
