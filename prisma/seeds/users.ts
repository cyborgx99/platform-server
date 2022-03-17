import { Prisma } from '@prisma/client';

export const users: Prisma.UserCreateInput[] = [
  {
    name: 'Bong',
    lastName: 'Johnson',
    email: 'cyborgx999@gmail.com',
    password: '123qwe',
  },
  {
    name: 'Bong',
    lastName: 'Johnson',
    email: 'cyborgx9991@gmail.com',
    password: '123qwe',
  },
];
