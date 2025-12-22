/*
  Warnings:

  - A unique constraint covering the columns `[cd]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_cd_key" ON "Project"("cd");
