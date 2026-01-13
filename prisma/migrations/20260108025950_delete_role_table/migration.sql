/*
  Warnings:

  - You are about to drop the column `role_id` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_role_id_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "role_id",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE "Role";

-- CreateIndex
CREATE INDEX "Category_deleted_at_idx" ON "Category"("deleted_at");

-- CreateIndex
CREATE INDEX "Profile_deleted_at_idx" ON "Profile"("deleted_at");
