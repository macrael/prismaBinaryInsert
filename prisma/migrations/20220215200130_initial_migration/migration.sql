-- CreateTable
CREATE TABLE "TestRecord" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "binData" BYTEA NOT NULL,

    CONSTRAINT "TestRecord_pkey" PRIMARY KEY ("id")
);
