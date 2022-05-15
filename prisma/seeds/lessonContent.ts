import { Prisma } from '@prisma/client';

import { userId } from './users';

export const lessonContent: Prisma.LessonContentCreateManyInput[] = [
  {
    title: 'my',
    userId,
    sentences: JSON.stringify([
      {
        id: '5b5123cd-4a72-47a9-9fe8-52f4ae8c3e9a',
        text: 'what are you doing?',
        sentenceParts: [
          {
            id: '4d218e7f-2958-4feb-aea0-1f807e3b4653',
            part: 'what',
            partType: 'Regular',
          },
          {
            id: '4797bd04-0481-4d7a-9c2f-4aa80f2cc5ab',
            part: 'are',
            partType: 'Gap',
          },
          {
            id: 'b3cbeb2a-7a54-4fb1-baae-fbaad10e1b48',
            part: 'you',
            partType: 'Regular',
          },
          {
            id: '99a6817a-c517-4ba2-8504-81ed53cd2887',
            part: 'doing?',
            partType: 'Regular',
          },
        ],
        sentenceType: 'Gap',
      },
      {
        id: 'ab13cd1b-62e2-40fc-9b8f-7824fe83da14',
        text: 'Who let the dogs out?',
        sentenceParts: [
          {
            id: '1915fc33-486d-4d0f-858d-2406289b8e9f',
            part: 'who who who',
            partType: 'RightAnswer',
          },
          {
            id: '07851142-cd49-4003-9a0f-b76eda64d1af',
            part: 'me',
            partType: 'WrongAnswer',
          },
          {
            id: 'd079383c-096c-4ee3-9fea-88e6e8e5cfdc',
            part: 'him',
            partType: 'WrongAnswer',
          },
          {
            id: '22711ffa-0995-4c84-9a27-a09805c7f0f1',
            part: 'Bob',
            partType: 'WrongAnswer',
          },
        ],
        sentenceType: 'Multi',
      },
    ]),
  },
  {
    title: 'other',
    userId,
    sentences: JSON.stringify([
      {
        id: '8b964aa6-013a-4531-b2be-d0f97f05abe4',
        text: 'hello where are you?',
        sentenceParts: [
          {
            id: 'f6e499e2-b987-430b-9333-9b82696ad4be',
            part: 'hello',
            partType: 'Regular',
          },
          {
            id: '21da4d77-3875-4221-ba11-47ebe26140b8',
            part: 'where',
            partType: 'Regular',
          },
          {
            id: '972df3f2-6740-4c47-94c2-e19ebb8435a4',
            part: 'are',
            partType: 'Gap',
          },
          {
            id: '620720ce-8e94-4bdd-a071-cca66b2be8a3',
            part: 'you?',
            partType: 'Regular',
          },
        ],
        sentenceType: 'Gap',
      },
      {
        id: '869b6f42-89e7-4dc9-9b95-3a707271a906',
        text: 'where is the door?',
        sentenceParts: [
          {
            id: 'c2176e54-00d3-4a14-9ad2-224a53fae68a',
            part: 'is',
            partType: 'Regular',
          },
          {
            id: '6705d952-c8bf-4080-a6fb-19d8908418f4',
            part: 'where',
            partType: 'Regular',
          },
          {
            id: 'f8c901ba-908f-4e54-8dcb-76d9793a7c6a',
            part: 'door?',
            partType: 'Regular',
          },
          {
            id: 'a177f8f0-93d4-4325-9670-8573ea9fdaff',
            part: 'the',
            partType: 'Regular',
          },
        ],
        sentenceType: 'Scramble',
      },
    ]),
  },
];
