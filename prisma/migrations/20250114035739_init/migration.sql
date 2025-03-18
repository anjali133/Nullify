/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_UserGroups` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_paid_by_fkey";

-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_user_id1_fkey";

-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_user_id2_fkey";

-- DropForeignKey
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_B_fkey";

-- AlterTable
ALTER TABLE "Expenses" ALTER COLUMN "paid_by" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Friends" ALTER COLUMN "user_id1" SET DATA TYPE TEXT,
ALTER COLUMN "user_id2" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
ALTER COLUMN "user_id" DROP DEFAULT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id");
DROP SEQUENCE "Users_user_id_seq";

-- AlterTable
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_UserGroups_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_user_id1_fkey" FOREIGN KEY ("user_id1") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_user_id2_fkey" FOREIGN KEY ("user_id2") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_paid_by_fkey" FOREIGN KEY ("paid_by") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGroups" ADD CONSTRAINT "_UserGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
