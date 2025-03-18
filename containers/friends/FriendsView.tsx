"use client";
import { Avatar, Button, Spin, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  useFetchFriendByIdQuery,
  useFetchExpensesQuery,
} from "@/provider/redux/services/user";
import AddExpenseModal from "./AddExpenseModal";
import SettleUpModal from "../../components/SettleUpModal";
import { Expense } from "@/type";

const FriendsViewPage = ({ pathId }: { pathId: string }) => {
  const router = useRouter();
  const [isAddExpenseModalOpen, setIsExpenseModalOpen] =
    useState<boolean>(false);
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] =
    useState<boolean>(false);

  const [friendData, setFriendData] = useState<any | null>(null);

  // Get user data from Auth0
  // const { user } = useUser();
  const user = {
    email: "anjaliarora200130@gmail.com",
    email_verified: true,
    family_name: "Arora",
    given_name: "Anjali",
    name: "Anjali Arora",
    nickname: "anjaliarora200130",
    picture: "https://lh3.googleusercontent.com/a/ACg8ocIJL8tOg3K6ULF_mNxbs0vpg-1ddV5CKarRLPUU7rer3ivTt_8=s96-c",
    sid: "8-27kHK8ZYJ73UgX2rydWmh9zFitfJ0G",
    sub: "google-oauth2|108250297011643233061",
    updated_at: "2025-03-18T02:12:29.592Z",
        }
  const loggedInUserId = user?.sub?.split("|")[1] || null;

  const { data: friend, isLoading: loadingFriend } =
    useFetchFriendByIdQuery(pathId);
  const {
    data: expenses,
    isLoading: loadingExpenses,
    error: expensesError,
  } = useFetchExpensesQuery(pathId);
  useEffect(() => {
    if (friend && loggedInUserId) {
      if (friend.user1?.user_id === loggedInUserId) {
        setFriendData(friend.user2);
      } else if (friend.user2?.user_id === loggedInUserId) {
        setFriendData(friend.user1);
      }
    }
  }, [friend, user]);

  const handleBackClick = () => {
    router.push("/friends");
  };

  return (
    <>
      {isAddExpenseModalOpen && (
        <AddExpenseModal
          isAddExpenseModalOpen={isAddExpenseModalOpen}
          setIsExpenseModalOpen={setIsExpenseModalOpen}
          friendData={friendData}
          loggedInUserId={loggedInUserId}
          pathId={pathId}
        />
      )}

      {isSettleUpModalOpen && (
        <SettleUpModal
          isSettleUpModalOpen={isSettleUpModalOpen}
          setIsSettleUpModalOpen={setIsSettleUpModalOpen}
        />
      )}

      <div className="text-white flex-1 flex flex-col pt-0">
        <div>
          <div className="flex items-center bg-custom p-4 py-0 mt-4 justify-between">
            <ArrowLeftOutlined
              className="text-white"
              onClick={handleBackClick}
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center">
              <Tooltip title={friendData?.email}>
                <h1 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#B57EDC]">
                  {friendData?.name}
                </h1>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-240px)] pb-20">
          {loadingExpenses ? (
            <div className="flex justify-center mt-10">
              <Spin size="large" />
            </div>
          ) : expenses?.expenses?.length === 0 ? (
            <p className="text-gray text-base font-normal">$0.00</p>
          ) : (
            expenses?.expenses?.map((expense: Expense) => (
              <div
                key={expense.id}
                className="flex items-center gap-4 bg-custom px-4 min-h-[72px] py-2 justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-start">
                    <div className="text-gray text-sm">
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-white text-md leading-normal line-clamp-1">
                      {expense.name}
                    </p>
                    <p
                      className={`text-${
                        expense.paid_by === loggedInUserId
                          ? "success"
                          : "danger"
                      } text-sm leading-normal line-clamp-1`}
                    >
                      {expense.paid_by === loggedInUserId
                        ? "You Paid"
                        : "You Owe"}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-${
                    expense.paid_by === loggedInUserId ? "success" : "danger"
                  } text-sm`}
                >
                  {expense.paid_by === loggedInUserId
                    ? `$${
                        loggedInUserId &&
                        expense.split_details?.[friendData?.user_id]?.amount
                          ? expense.split_details[friendData.user_id].amount
                          : 0
                      }`
                    : `$${
                        loggedInUserId &&
                        expense.split_details?.[loggedInUserId]?.amount
                          ? expense.split_details[loggedInUserId].amount
                          : 0
                      }`}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="fixed bottom-20 left-0 w-full flex flex-col gap-3 p-4 bg-custom max-w-[480px] mx-auto">
          <Button
            type="primary"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 text-white text-base font-bold leading-normal tracking-[0.015em] w-full"
            onClick={() => setIsSettleUpModalOpen(true)}
          >
            Settle Up
          </Button>
          <Button
            className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-xl h-10 px-4 !bg-[#283039] !border-[#283039] !text-white text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px]"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            Add Expense
          </Button>
        </div>
      </div>
    </>
  );
};

export default FriendsViewPage;
