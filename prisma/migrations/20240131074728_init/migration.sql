/*
  Warnings:

  - Added the required column `password` to the `User_prisma` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `user_prisma` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user_prisma` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;
