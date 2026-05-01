/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "auth"."identifier_type" AS ENUM ('PHONE', 'EMAIL');

-- AlterTable
ALTER TABLE "auth"."users" ADD COLUMN     "emailVerifiedAt" TIMESTAMP(6),
ADD COLUMN     "identifierType" "auth"."identifier_type" NOT NULL DEFAULT 'EMAIL',
ADD COLUMN     "phone" VARCHAR(20),
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "auth"."users"("phone");
