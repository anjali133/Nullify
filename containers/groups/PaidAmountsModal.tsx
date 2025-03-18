import { Avatar, Button, Input, List, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import AdjustSplitModal from "./AdjustSplitModal";

interface PaidAmountsModalProps {
  isPaidAmountsModalOpen: boolean;
  setIsPaidAmountsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  memberDetailsArray: Array<{
    id: string;
    name: string;
  }>;
  amount: string;
  handleMultipleSelectFriend: (data: any) => void;
  paidBy: any;
  setPaidBy: React.Dispatch<React.SetStateAction<any>>;
}

interface PaidAmounts {
  [key: string]: {
    amount: string;
    name: string;
  };
}

const PaidAmountsModal: React.FC<PaidAmountsModalProps> = ({
  isPaidAmountsModalOpen,
  setIsPaidAmountsModalOpen,
  memberDetailsArray,
  amount,
  handleMultipleSelectFriend,
  paidBy,
  setPaidBy
}) => {
  console.log(paidBy);
  const [adjustSplitModal, setAdjustSplitModal] = useState(false);
  const [paidAmounts, setPaidAmounts] = useState<PaidAmounts>({});

  // Initialize paid amounts with empty values
  useEffect(() => {
    const initialPaidAmounts: PaidAmounts = {};
    memberDetailsArray.forEach((member) => {
      initialPaidAmounts[member.id] = {
        amount: paidBy[member.id]?.amount || "", // Ensure it syncs with `paidBy`
        name: member.name,
      };
    });
    setPaidAmounts(initialPaidAmounts);
  }, [memberDetailsArray]);

  const handleAmountChange = (id: string, value: string, name: string) => {
    setPaidBy((prev) => ({
      ...prev,
      [id]: { ...prev[id], amount: value, name }
    }));
    setPaidAmounts((prev) => ({
      ...prev,
      [id]: { amount: value, name }
    }));
  };

  const handleConfirm = () => {
    // Pass the formatted data to the parent component
    handleMultipleSelectFriend(paidAmounts);
    setIsPaidAmountsModalOpen(false);
  };

  // Calculate totals for display
  const totalPaid = Object.values(paidAmounts).reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  const totalAmount = parseFloat(amount) || 0;
  const remaining = totalAmount - totalPaid;
console.log(paidAmounts);
  return (
    <div>
      {adjustSplitModal && (
        <AdjustSplitModal
          isAdjustSplitModalOpen={adjustSplitModal}
          setIsAdjustSplitModalOpen={setAdjustSplitModal}
        />
      )}
      <Modal
        title={
          <div className="bg-[#111418] p-4 pb-0 flex items-center justify-between">
            <h2 className="!leading-tight !tracking-[-0.015em] !text-lg font-bold">
              Enter Paid Amounts
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={() => setIsPaidAmountsModalOpen(false)}
              className="text-white hover:bg-transparent"
            />
          </div>
        }
        open={isPaidAmountsModalOpen}
        onCancel={() => setIsPaidAmountsModalOpen(false)}
        footer={null}
        style={{
          backgroundColor: "#111418",
          top: 0,
          margin: 0,
          maxWidth: "100vw",
          height: "100vh",
          maxHeight: "100vh",
        }}
        className="expense-modal"
        closable={false}
        maskClosable={false}
      >
        <div className="space-y-4 pl-4 pr-6 pt-0">
          <List
            itemLayout="horizontal"
            dataSource={memberDetailsArray}
            renderItem={(friend) => (
              <List.Item className="cursor-pointer flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Avatar
                    style={{
                      backgroundColor: friend.avatarColor,
                      verticalAlign: "middle",
                    }}
                  >
                    {friend.name[0]}
                  </Avatar>
                  <div>
                    <p className="text-white text-[15px] leading-normal line-clamp-1">
                      {friend.name}
                    </p>
                  </div>
                </div>
                <Input
                  placeholder="₹ 0"
                  type="number"
                  value={paidBy[friend.id]?.amount ?? ''}
                  onChange={(e) => {
                        handleAmountChange(friend.id, e.target.value, friend.name);
                      }
                  }
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === ".") {
                      e.preventDefault();
                    }
                  }}
                  className="h-7 !w-20 !bg-[#283039] text-white !placeholder-[#9caaba] !border-none focus:ring-0"
                />
              </List.Item>
            )}
          />
          <div
            className="fixed bottom-0 left-0 w-full bg-[#111418] p-4"
            style={{ maxWidth: "480px", margin: "0 auto" }}
          >
            <div className="text-center m-4">
              <p
                className={` text-md leading-normal ${
                  totalPaid > parseFloat(totalAmount.toFixed(2))
                    ? "!text-red-500"
                    : totalPaid === parseFloat(totalAmount.toFixed(2))
                    ? "!text-green-500"
                    : ""
                }`}
              >
                ₹{totalPaid.toFixed(2)} of ₹{totalAmount.toFixed(2)}
              </p>
              <p className="text-gray text-sm leading-normal break-words">
                ₹{remaining.toFixed(2)} left
              </p>
            </div>
            <Button
              className="!bg-[#B57EDC] !border-[#283039] w-full"
              onClick={handleConfirm}
              disabled={totalPaid === parseFloat(totalAmount.toFixed(2)) ? false : true}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaidAmountsModal;
