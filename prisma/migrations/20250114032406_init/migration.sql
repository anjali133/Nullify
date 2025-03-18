/*
  Warnings:

  - You are about to drop the column `is_verified` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_phone_number_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "is_verified",
DROP COLUMN "password",
DROP COLUMN "phone_number",
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false;
