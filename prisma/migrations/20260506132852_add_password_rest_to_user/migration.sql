/*
  Warnings:

  - A unique constraint covering the columns `[passwordResetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "auth"."users" ADD COLUMN     "passwordResetExpires" TIMESTAMP(6),
ADD COLUMN     "passwordResetToken" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordResetToken_key" ON "auth"."users"("passwordResetToken");
