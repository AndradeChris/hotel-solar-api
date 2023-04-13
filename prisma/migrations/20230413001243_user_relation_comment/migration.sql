/*
  Warnings:

  - Added the required column `user_id` to the `comments_avaliation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments_avaliation" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "comments_avaliation" ADD CONSTRAINT "comments_avaliation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
