/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[auth0id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `auth0id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `question_quiz_id_foreign`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`,
    DROP COLUMN `role`,
    ADD COLUMN `auth0id` VARCHAR(255) NOT NULL,
    MODIFY `username` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_auth0id_key` ON `user`(`auth0id`);

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
