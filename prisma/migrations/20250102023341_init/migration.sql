/*
  Warnings:

  - Added the required column `updated_at` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FriendGroupBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Friends` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_group_id_fkey";

-- AlterTable
ALTER TABLE "Expenses" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "friendship_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "group_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FriendGroupBalance" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Groups" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_friendship_id_fkey" FOREIGN KEY ("friendship_id") REFERENCES "Friends"("friendship_id") ON DELETE SET NULL ON UPDATE CASCADE;
