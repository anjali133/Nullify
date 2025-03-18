import { Avatar, Button, Checkbox, Input, List, Modal, Tabs } from "antd";
import {
  CloseOutlined,
  WalletOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
interface AdjustSplitModalProps {
  isAdjustSplitModalOpen: boolean;
  setIsAdjustSplitModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  splitwith: PaidAmounts;
  setSplitWith: (data: any) => void;
  amount: string;
  activeKey: string;
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
  memberDetailsArray: Array<{
    id: string;
    name: string;
  }>;
}
interface PaidAmounts {
  [key: string]: {
    amount: string;
    name: string;
  };
}

const AdjustSplitModal: React.FC<AdjustSplitModalProps> = ({
  isAdjustSplitModalOpen,
  setIsAdjustSplitModalOpen,
  splitwith,
  setSplitWith,
  amount,
  activeKey,
  setActiveKey,
  memberDetailsArray,
}) => {
  // const params = useParams();
  // const group_id = params.id;
  // const { data: group, isLoading } = useFetchSingleGroupQuery(
  //   parseInt(group_id),
  //   {
  //     skip: !group_id,
  //   }
  // );
  const { user, isLoading: userLoading } = useUser();
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [initialAmount, setInitialAmount] = useState("0");
  const [paidAmounts, setPaidAmounts] = useState<PaidAmounts>({});

  const handleAmountChange = (id: string, value: string, name: string) => {
    const wholeNumber = Math.floor(parseFloat(value) || 0);

    setPaidAmounts((prev) => ({
      ...prev,
      [id]: {
        amount: wholeNumber.toString(),
        name: name,
      },
    }));

    setSplitWith((prev: any) => ({
      ...prev,
      [id]: {
        amount: wholeNumber.toString(),
        name: name,
      },
    }));
  };

  useEffect(() => {
    setPaidAmounts(splitwith);
  }, [splitwith]);

  const totalPaid = Object.values(paidAmounts).reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  const totalAmount = parseFloat(amount) || 0;
  const remaining = totalAmount - totalPaid;

  const userId = String(user?.sub?.split("|")[1]);
  // const memberDetailsArray = Object.entries(group?.member_details || {}).map(
  //   ([id, details]) => ({
  //     id,
  //     name: details.name,
  //     amount: details.amount,
  //   })
  // );

  const handleTabChange = (key: string) => {
    setActiveKey(key); // Update active tab on change
  };

  const onCheckBoxChange = (id: string, name: string) => {
    setSplitWith((prev: any) => {
      const newSplitWith = { ...prev };

      console.log(newSplitWith);

      if (newSplitWith[id]) {
        delete newSplitWith[id];
      } else {
        newSplitWith[id] = {
          amount: "0",
          name: name || "",
        };
      }

      return newSplitWith;
    });
  };

  const handleSubmit = () => {
    if (activeKey === "1") {
      const selectedMembers = Object.keys(splitwith);
      console.log(splitwith);
      const equalAmount = (parseFloat(amount) / selectedMembers.length).toFixed(
        2
      );

      const equalSplitData = selectedMembers.reduce((acc, memberId) => {
        acc[memberId] = {
          ...acc[memberId],
          amount: equalAmount,
          name: splitwith[memberId]?.name || "",
        };
        return acc;
      }, {});
      console.log(equalSplitData);
      setSplitWith(equalSplitData);
      setIsAdjustSplitModalOpen(false);
    }
    if (activeKey === "2") {
      const unequalSplitData: Record<string, { amount: string; name: string }> =
        {};

      let totalAllocated = 0;

      memberDetailsArray.forEach((member) => {
        const inputElement = document.getElementById(
          `amount-${member.id}`
        ) as HTMLInputElement;
        const inputAmount = parseFloat(inputElement.value || "0");

        if (inputAmount > 0) {
          unequalSplitData[member.id] = {
            amount: inputAmount.toFixed(2),
            name: member.name,
          };
          totalAllocated += inputAmount;
        }
      });

      if (Math.abs(totalAllocated - parseFloat(amount)) > 0.01) {
        return;
      }

      setSplitWith(unequalSplitData);
      setIsAdjustSplitModalOpen(false);
    }
  };
  console.log(splitwith);
  return (
    <div>
      <Modal
        title={
          <div className="bg-[#111418] p-4 pb-0 flex items-center justify-between">
            <h2 className="!leading-tight !tracking-[-0.015em] !text-lg font-bold">
              Adjust Split
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={() => setIsAdjustSplitModalOpen(false)}
              className="text-white hover:bg-transparent"
            />
          </div>
        }
        open={isAdjustSplitModalOpen}
        onCancel={() => setIsAdjustSplitModalOpen(false)}
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
        <div className="space-y-4 pl-4 pr-6 pt-0 pb-16">
          <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            onChange={handleTabChange}
            items={[
              {
                key: "1",
                label: "Equally",
                icon: <WalletOutlined />,
                children: (
                  <div>
                    <div className="text-center">
                      <div className="m-6">
                        <p className="text-white text-md leading-normal">
                          Split Equally
                        </p>
                        <p className="text-gray text-sm leading-normal break-words">
                          Distribute the amount equally among the selected
                          individuals.
                        </p>
                      </div>
                      <List
                        itemLayout="horizontal"
                        dataSource={memberDetailsArray}
                        renderItem={(friend) => (
                          <List.Item className="cursor-pointer flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <Avatar>{friend.name[0]}</Avatar>
                              <p className="text-white text-[15px] leading-normal line-clamp-1">
                                {friend.name}
                              </p>
                            </div>
                            <Checkbox
                              onChange={() =>
                                onCheckBoxChange(friend.id, friend.name)
                              }
                              checked={splitwith.hasOwnProperty(friend.id)}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "2",
                label: "Unequally",
                icon: <CalculatorOutlined />,
                children: (
                  <div>
                    <div className="text-center">
                      <div className="m-6">
                        <p className="text-white text-md leading-normal">
                          Split by exact amounts
                        </p>
                        <p className="text-gray text-sm leading-normal break-words">
                          Assign specific amounts to each individual based on
                          their share.
                        </p>
                      </div>
                      <List
                        itemLayout="horizontal"
                        dataSource={memberDetailsArray}
                        renderItem={(friend) => (
                          <List.Item className="cursor-pointer flex justify-between items-center">
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
                            <Input
                              id={`amount-${friend.id}`}
                              type="number"
                              placeholder="₹ 0"
                              value={
                                Math.floor(
                                  parseFloat(
                                    splitwith[friend.id]?.amount || "0"
                                  )
                                ) || ""
                              }
                              onChange={(e) =>
                                handleAmountChange(
                                  friend.id,
                                  e.target.value,
                                  friend.name
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "-" || e.key === ".") {
                                  e.preventDefault();
                                }
                              }}
                              className="h-7 !w-20 !bg-[#283039] text-white !placeholder-[#9caaba] !border-none focus:border-b-white focus:ring-0"
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
          <div
            className="fixed bottom-0 left-0 w-full bg-[#111418] p-4"
            style={{ maxWidth: "480px", margin: "0 auto" }}
          >
            {activeKey === "2" ? (
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
            ) : null}
            <Button
              className="!bg-[#B57EDC] !border-[#283039] w-full"
              onClick={handleSubmit}
              disabled={
                activeKey == "2"
                  ? totalPaid === parseFloat(totalAmount.toFixed(2))
                    ? false
                    : true
                  : false
              }
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdjustSplitModal;
