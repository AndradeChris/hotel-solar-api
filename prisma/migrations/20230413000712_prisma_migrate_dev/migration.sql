-- CreateTable
CREATE TABLE "comments_avaliation" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "avaliation" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "comments_avaliation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comments_avaliation" ADD CONSTRAINT "comments_avaliation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
