-- CreateTable
CREATE TABLE "workers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workers_token" (
    "id" SERIAL NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "workers_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workers_id_key" ON "workers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "workers_email_key" ON "workers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "workers_token_refresh_token_key" ON "workers_token"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "workers_token_worker_id_key" ON "workers_token"("worker_id");

-- AddForeignKey
ALTER TABLE "workers_token" ADD CONSTRAINT "workers_token_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
