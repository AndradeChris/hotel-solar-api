/*
  Warnings:

  - You are about to drop the column `additionalServices_Id` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[booking_id]` on the table `aditional_services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `booking_id` to the `aditional_services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_additionalServices_Id_fkey";

-- DropIndex
DROP INDEX "bookings_additionalServices_Id_key";

-- AlterTable
ALTER TABLE "aditional_services" ADD COLUMN     "booking_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "additionalServices_Id";

-- CreateIndex
CREATE UNIQUE INDEX "aditional_services_booking_id_key" ON "aditional_services"("booking_id");

-- AddForeignKey
ALTER TABLE "aditional_services" ADD CONSTRAINT "aditional_services_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
