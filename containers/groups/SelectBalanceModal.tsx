import { Avatar, Button, List, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import SettleUpModal from "../../components/SettleUpModal";

interface SelectBalanceModalProps {
  isSelectBalanceModalOpen: boolean;
  setIsSelectBalanceModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectBalanceModal: React.FC<SelectBalanceModalProps> = ({
  isSelectBalanceModalOpen,
  setIsSelectBalanceModalOpen,
}) => {
  const friends = [
    {
      id: "234",
      name: "Kanika",
      status: "you owe",
      amount: "$250.00",
      avatarColor: "#a6a6a6",
    },
    {
      id: "235",
      name: "Shreyansh Garg",
      status: "settled up",
      amount: "",
      avatarColor: "#0066cc",
    },
  ];

  const [showSettleUpModal, setShowSettleUpModal] = useState(false);

  return (
    <div>
      {showSettleUpModal && (
        <SettleUpModal
          isSettleUpModalOpen={showSettleUpModal}
          setIsSettleUpModalOpen={setShowSettleUpModal}
        />
      )}
      <Modal
        title={
          <div className="bg-[#111418] p-4 pb-0 flex items-center justify-between">
            <h2 className="!leading-tight !tracking-[-0.015em] !text-lg font-bold">
              Select A Balance to Settle Up
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={() => setIsSelectBalanceModalOpen(false)}
              className="text-white hover:bg-transparent"
            />
          </div>
        }
        open={isSelectBalanceModalOpen}
        onCancel={() => setIsSelectBalanceModalOpen(false)}
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
        <div className="space-y-4 pl-4 pr-6 pt-0 ">
          <List
            itemLayout="horizontal"
            dataSource={friends}
            renderItem={(friend) => (
              <List.Item
                onClick={() => setShowSettleUpModal(true)}
                className="cursor-pointer flex justify-between items-center"
              >
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
                    <p
                      className={`${
                        friend.status === "you owe"
                          ? "text-danger"
                          : "text-success"
                      } text-sm leading-normal line-clamp-1`}
                    >
                      {friend.status === "you owe" ? "Owes You" : "Settled Up"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end text-right">
                  {friend.amount && <p className="text-danger text-sm">$20</p>}
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SelectBalanceModal;
