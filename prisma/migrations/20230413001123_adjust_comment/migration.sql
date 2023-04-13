/*
  Warnings:

  - You are about to drop the column `roomId` on the `comments_avaliation` table. All the data in the column will be lost.
  - Added the required column `room_id` to the `comments_avaliation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments_avaliation" DROP CONSTRAINT "comments_avaliation_roomId_fkey";

-- AlterTable
ALTER TABLE "comments_avaliation" DROP COLUMN "roomId",
ADD COLUMN     "room_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "comments_avaliation" ADD CONSTRAINT "comments_avaliation_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
