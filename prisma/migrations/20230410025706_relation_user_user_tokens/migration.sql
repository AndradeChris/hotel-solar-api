/*
  Warnings:

  - Added the required column `user_id` to the `users_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users_token" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "users_token" ADD CONSTRAINT "users_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
