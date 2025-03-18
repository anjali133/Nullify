/*
  Warnings:

  - Changed the type of `paid_by` on the `Expenses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_paid_by_fkey";

-- DropIndex
DROP INDEX "Expenses_paid_by_idx";

-- AlterTable
ALTER TABLE "Expenses" DROP COLUMN "paid_by",
ADD COLUMN     "paid_by" JSONB NOT NULL;
