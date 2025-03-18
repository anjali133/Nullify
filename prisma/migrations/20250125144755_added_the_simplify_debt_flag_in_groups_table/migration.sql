/*
  Warnings:

  - Added the required column `simplify_debt` to the `Groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Groups" ADD COLUMN     "simplify_debt" BOOLEAN NOT NULL;
