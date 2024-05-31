-- DropForeignKey
ALTER TABLE `quiz` DROP FOREIGN KEY `quiz_user_id_foreign`;

-- AddForeignKey
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
