/*
  Warnings:

  - You are about to drop the column `active` on the `grade_levels` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `grade_levels` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `groups` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `grade_levels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[academicYearId,gradeLevelId,number]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `grade_levels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `grade_levels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_gradeLevelId_fkey";

-- DropIndex
DROP INDEX "grade_levels_name_key";

-- DropIndex
DROP INDEX "groups_academicYearId_name_key";

-- AlterTable
ALTER TABLE "grade_levels" DROP COLUMN "active",
DROP COLUMN "level",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "active",
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "grade_levels_code_key" ON "grade_levels"("code");

-- CreateIndex
CREATE UNIQUE INDEX "groups_academicYearId_gradeLevelId_number_key" ON "groups"("academicYearId", "gradeLevelId", "number");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "grade_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
