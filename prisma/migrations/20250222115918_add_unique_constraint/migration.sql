/*
  Warnings:

  - A unique constraint covering the columns `[friendship_id,group_id]` on the table `FriendGroupBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FriendGroupBalance_friendship_id_group_id_key" ON "FriendGroupBalance"("friendship_id", "group_id");
