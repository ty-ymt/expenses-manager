-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completed_at" TIMESTAMPTZ;
