/*
  Warnings:

  - You are about to drop the column `created_at` on the `users_token` table. All the data in the column will be lost.
  - Changed the type of `expires_in` on the `users_token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users_token" DROP COLUMN "created_at",
DROP COLUMN "expires_in",
ADD COLUMN     "expires_in" INTEGER NOT NULL;
