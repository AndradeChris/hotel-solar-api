/*
  Warnings:

  - The required column `reserve_id` was added to the `bookings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "reserve_id" TEXT NOT NULL;
