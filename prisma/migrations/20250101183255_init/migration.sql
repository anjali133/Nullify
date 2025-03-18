-- CreateTable
CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Friends" (
    "friendship_id" SERIAL NOT NULL,
    "user_id1" INTEGER NOT NULL,
    "user_id2" INTEGER NOT NULL,
    "balances" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("friendship_id")
);

-- CreateTable
CREATE TABLE "Groups" (
    "group_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "member_details" JSONB NOT NULL,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "expense_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL,
    "split_type" TEXT NOT NULL,
    "paid_by" INTEGER NOT NULL,
    "split_details" JSONB NOT NULL,
    "group_id" INTEGER NOT NULL,
    "is_settled" BOOLEAN NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("expense_id")
);

-- CreateTable
CREATE TABLE "FriendGroupBalance" (
    "id" SERIAL NOT NULL,
    "friendship_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "balances" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "FriendGroupBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_number_key" ON "Users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_name_idx" ON "Users"("name");

-- CreateIndex
CREATE INDEX "Friends_user_id2_idx" ON "Friends"("user_id2");

-- CreateIndex
CREATE INDEX "Friends_balances_idx" ON "Friends"("balances");

-- CreateIndex
CREATE INDEX "Groups_name_idx" ON "Groups"("name");

-- CreateIndex
CREATE INDEX "Expenses_paid_by_idx" ON "Expenses"("paid_by");

-- CreateIndex
CREATE INDEX "Expenses_group_id_idx" ON "Expenses"("group_id");

-- CreateIndex
CREATE INDEX "FriendGroupBalance_friendship_id_idx" ON "FriendGroupBalance"("friendship_id");

-- CreateIndex
CREATE INDEX "FriendGroupBalance_group_id_idx" ON "FriendGroupBalance"("group_id");

-- CreateIndex
CREATE INDEX "FriendGroupBalance_balances_idx" ON "FriendGroupBalance"("balances");

-- CreateIndex
CREATE INDEX "_UserGroups_B_index" ON "_UserGroups"("B");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_user_id1_fkey" FOREIGN KEY ("user_id1") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_user_id2_fkey" FOREIGN KEY ("user_id2") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_paid_by_fkey" FOREIGN KEY ("paid_by") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendGroupBalance" ADD CONSTRAINT "FriendGroupBalance_friendship_id_fkey" FOREIGN KEY ("friendship_id") REFERENCES "Friends"("friendship_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendGroupBalance" ADD CONSTRAINT "FriendGroupBalance_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGroups" ADD CONSTRAINT "_UserGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGroups" ADD CONSTRAINT "_UserGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
