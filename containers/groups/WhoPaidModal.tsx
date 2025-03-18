import { Avatar, Button, List, Modal } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import PaidAmountsModal from "./PaidAmountsModal";
import { useFetchSingleGroupQuery } from "@/provider/redux/services/group";
import { useParams } from "next/navigation";

interface WhoPaidModalProps {
  isWhoPaidModalOpen: boolean;
  setIsWhoPaidModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updatePaidBy: (data: any) => void;
  paidBy: {
    [key: string]: {
      amount: string;
      name: string;
    };
  };
  amount: string;
  setPaidBy: React.Dispatch<React.SetStateAction<any>>;
}

const WhoPaidModal: React.FC<WhoPaidModalProps> = ({
  isWhoPaidModalOpen,
  setIsWhoPaidModalOpen,
  updatePaidBy,
  paidBy,
  amount,
  setPaidBy,
}) => {
  const params = useParams();
  const group_id = params.id;
  const { data: group, isLoading } = useFetchSingleGroupQuery(
    parseInt(group_id),
    {
      skip: !group_id,
    }
  );
  const memberDetailsArray = Object.entries(group?.member_details || {}).map(
    ([id, details]) => ({
      id,
      name: details.name,
      amount: details.amount,
    })
  );
  const [paidAmountsModal, setPaidAmountsModal] = useState(false);

  const handleSingleSelectFriend = (id: string, name: string) => {
    const data = {
      [id]: {
        amount: amount,
        name: name || "",
      },
    };
    updatePaidBy(data);
    setIsWhoPaidModalOpen(false);
  };
  // console.log(paidBy);

  const handleMultipleSelectFriend = (paidAmounts: any) => {
    console.log(paidAmounts);
    updatePaidBy(paidAmounts);
    setPaidAmountsModal(false);
    setIsWhoPaidModalOpen(false);
  };
  return (
    <div>
      {paidAmountsModal && (
        <PaidAmountsModal
          isPaidAmountsModalOpen={paidAmountsModal}
          setIsPaidAmountsModalOpen={setPaidAmountsModal}
          memberDetailsArray={memberDetailsArray}
          amount={amount}
          handleMultipleSelectFriend={handleMultipleSelectFriend}
          paidBy={paidBy}
          setPaidBy={setPaidBy}
        />
      )}
      <Modal
        title={
          <div className="bg-[#111418] p-4 pb-0 flex items-center justify-between">
            <h2 className="!leading-tight !tracking-[-0.015em] !text-lg font-bold">
              Who Paid?
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={() => setIsWhoPaidModalOpen(false)}
              className="text-white hover:bg-transparent"
            />
          </div>
        }
        open={isWhoPaidModalOpen}
        onCancel={() => setIsWhoPaidModalOpen(false)}
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
              <List.Item
                onClick={() => handleSingleSelectFriend(friend.id, friend.name)}
                className="cursor-pointer flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    style={{
                      // backgroundColor: friend.avatarColor,
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

                {/* Tick icon for selected user */}
                <div className="flex flex-col items-end text-right">
                  {Object.entries(paidBy).map(([paidById, details]) =>
                    paidById == friend.id && Number(details.amount) > 0 ? (
                      <CheckOutlined
                        key={paidById}
                        className="text-green-500 text-lg"
                      />
                    ) : null
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
        <Button
          className="m-6 !bg-[#283039] !border-[#283039]"
          onClick={() => setPaidAmountsModal(true)}
        >
          Multiple people
        </Button>
      </Modal>
    </div>
  );
};

export default WhoPaidModal;
