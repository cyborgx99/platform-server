/*
  Warnings:

  - You are about to drop the column `img` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "img",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageId" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LessonImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "title" TEXT NOT NULL,

    CONSTRAINT "LessonImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_imageId_key" ON "Lesson"("imageId");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "LessonImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
