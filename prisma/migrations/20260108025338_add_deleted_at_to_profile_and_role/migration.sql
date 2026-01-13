/*
  Warnings:

  - A unique constraint covering the columns `[auth_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "deleted_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "deleted_at" TIMESTAMPTZ;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_auth_id_key" ON "Profile"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");
