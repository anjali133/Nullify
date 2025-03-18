import { Avatar, Button, Spin } from "antd";
import { ArrowLeftOutlined, CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";
import SelectBalanceModal from "./SelectBalanceModal";
import { useParams } from "next/navigation";
import { useFetchSingleGroupQuery } from "@/provider/redux/services/group";
import { useFetchGroupExpenseQuery } from "@/provider/redux/services/group";
import { Expense } from "@/type";
import { useUser } from "@auth0/nextjs-auth0/client";

const GroupsViewPage = () => {
  const router = useRouter();
  const params = useParams();
  const group_id = params.id;
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
  const [isAddExpenseModalOpen, setIsExpenseModalOpen] =
    useState<boolean>(false);
  const [isSelectBalanceModalOpen, setIsSelectBalanceModalOpen] =
    useState<boolean>(false);
  console.log(group_id);
  const { data: group, isLoading } = useFetchSingleGroupQuery(
    parseInt(group_id),
    {
      skip: !group_id,
    }
  );
  const { data: groupExpenses, isLoading: isLoadingExpenses } =
    useFetchGroupExpenseQuery(parseInt(group_id), { skip: !group_id });
  console.log(groupExpenses);
  const handleBackClick = () => {
    router.push("/groups");
  };

  const handleBorrowedAmount = (expense: Expense) => {
    let borrowedAmount = 0;
    for(let split of expense.split_details) {
      if(split.user1 == loggedInUserId || split.user2 == loggedInUserId) {
        borrowedAmount += split.amount;
      }
    } 
    return borrowedAmount;
  }

  return (
    <>
      {isAddExpenseModalOpen && (
        <AddExpenseModal
          isAddExpenseModalOpen={isAddExpenseModalOpen}
          setIsExpenseModalOpen={setIsExpenseModalOpen}
          group={group}
        />
      )}

      {isSelectBalanceModalOpen && (
        <SelectBalanceModal
          isSelectBalanceModalOpen={isSelectBalanceModalOpen}
          setIsSelectBalanceModalOpen={setIsSelectBalanceModalOpen}
        />
      )}

      <div className="text-white flex-1 flex flex-col pt-0">
        <div>
          <div className="flex items-center bg-custom p-4 pb-0 justify-between">
            <ArrowLeftOutlined
              className="text-white"
              onClick={handleBackClick}
            />
          </div>
          <div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <h1 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#B57EDC]">
                  {group?.name}
                </h1>
                <p className="text-gray text-base font-normal">$0.00</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-240px)] pb-20">
            {isLoadingExpenses ? (
              <div className="flex justify-center mt-10">
                <Spin size="large" />
              </div>
            ) : groupExpenses?.length === 0 ? (
              <div className="flex justify-center items-center h-full p-10">
                <SearchOutlined />
                <p className="text-gray text-base font-normal ml-4">No result found</p>
              </div>
            ) : (
              groupExpenses?.map((expense: Expense) => (
                <div
                  key={expense.id}
                  className="flex items-center gap-4 bg-custom px-4 min-h-[72px] py-2 justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-start">
                      <div className="text-gray text-xs">
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-white text-md leading-normal line-clamp-1">
                        {expense.name}
                      </p>
                      <p className={`text-gray text-xs`}>
                        {Object.keys(expense.paid_by).length > 1
                          ? `Multiple people paid ${expense.total_amount}`
                          : Object.entries(expense.paid_by).map(
                              ([id, details]) =>
                                id === loggedInUserId
                                  ? `You Paid ${expense.total_amount}`
                                  : `${details?.name} Paid ${expense.total_amount}`
                            )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                  <p className={`text-${loggedInUserId && expense.paid_by?.hasOwnProperty(loggedInUserId) ? "success" : handleBorrowedAmount(expense) > 0 ? "danger" : "gray"} text-xs text-right`}>
                  {loggedInUserId && expense.paid_by?.hasOwnProperty(loggedInUserId) ? "You Lent" : handleBorrowedAmount(expense) > 0 ? "You Borrowed" : "You're not involved"}
                    </p>
                    <p className={`text-${loggedInUserId && expense.paid_by?.hasOwnProperty(loggedInUserId) ? "success" : handleBorrowedAmount(expense) > 0 ? "danger" : "gray"} text-xs text-right`}>
                      {loggedInUserId && expense.paid_by?.hasOwnProperty(loggedInUserId) ? `₹ ${parseFloat(expense?.paid_by[loggedInUserId]?.amount || "0").toFixed(2)}` : handleBorrowedAmount(expense) > 0 ? `₹ ${handleBorrowedAmount(expense).toFixed(2)}` : ""}
                    </p>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
        <div className="fixed bottom-20 left-0 w-full flex flex-col gap-3 p-4 bg-custom max-w-[480px] mx-auto">
          <Button
            type="primary"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 text-white text-base font-bold leading-normal tracking-[0.015em] w-full"
            onClick={() => setIsSelectBalanceModalOpen(true)}
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

export default GroupsViewPage;
