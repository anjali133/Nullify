-- AlterTable
ALTER TABLE "Expenses" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FriendGroupBalance" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Groups" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "uuid" DROP NOT NULL;
