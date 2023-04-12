/*
  Warnings:

  - Added the required column `role_id` to the `workers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workers" ADD COLUMN     "role_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "workers_roles" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "workers_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workers_roles_type_key" ON "workers_roles"("type");

-- AddForeignKey
ALTER TABLE "workers" ADD CONSTRAINT "workers_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "workers_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
