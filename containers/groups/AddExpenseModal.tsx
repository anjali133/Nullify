import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, notification } from "antd";
import { CloseOutlined, RightOutlined } from "@ant-design/icons";
import WhoPaidModal from "./WhoPaidModal";
import AdjustSplitModal from "./AdjustSplitModal";
import { Group } from "@/type";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useParams } from "next/navigation";
import {
  useCreateGroupExpenseMutation,
  useFetchSingleGroupQuery,
} from "@/provider/redux/services/group";

interface AddExpenseModalProps {
  isAddExpenseModalOpen: boolean;
  setIsExpenseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: Group;
}

interface PaidBy {
  [key: string]: {
    amount: string;
    name: string;
  };
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isAddExpenseModalOpen,
  setIsExpenseModalOpen,
}) => {
  const { user, isLoading } = useUser();
  const userId = String(user?.sub?.split("|")[1]);
  const params = useParams();
  const group_id = params.id;
  const groupIdString = Array.isArray(group_id) ? group_id[0] : group_id;

  const { data: group, isLoading: isGroupDetailLoading } =
  useFetchSingleGroupQuery(parseInt(groupIdString || "0"), { skip: !groupIdString });
  const memberDetailsArray = Object.entries(group?.member_details || {}).map(
    ([id, details ]) => ({
      id,
      name: (details as { name: string; amount: number }).name,
      amount: (details as { name: string; amount: number }).amount,
    })
  );
  const [createGroupExpense] = useCreateGroupExpenseMutation();

  const [activeKey, setActiveKey] = useState("1");
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedSplitOption, setSelectedSplitOption] =
    useState("split_equally");
  const [isWhoPaidModalOpen, setIsWhoPaidModalOpen] = useState(false);
  const [paidBy, setPaidBy] = useState<PaidBy>({
    [userId]: {
      amount: "0",
      name: user?.nickname || "",
    },
  });
  const [splitwith, setSplitWith] = useState<PaidBy>({});

  useEffect(() => {
    setPaidBy({
      [userId]: {
        amount: "0",
        name: user?.nickname || "",
      },
    });
  }, [user]);

  useEffect(() => {
    if (Object.keys(splitwith).length === 0) {
      const initialSplitWith = Object.fromEntries(
        memberDetailsArray.map((friend) => [
          friend.id,
          { amount: "0", name: friend.name },
        ])
      );
      setSplitWith(initialSplitWith);
    }
  }, [group]);

  const [adjustSplitModal, setAdjustSplitModal] = useState(false);

  // Create form instance using Form.useForm
  const [form] = Form.useForm();

  const updatePaidBy = (data: PaidBy) => {
    setPaidBy(data);
  };

  const onFinish = async (values: any) => {
    let formData;
    let updatedSplitWith = { ...splitwith };
    let updatedPaidBy = { ...paidBy };
  
    // If splitting equally
    if (activeKey === "1") {
      const selectedMembers = Object.keys(splitwith);
      const equalAmount = (parseFloat(amount) / selectedMembers.length).toFixed(2);
  
      updatedSplitWith = selectedMembers.reduce((acc, memberId) => {
        acc[memberId] = {
          name: splitwith[memberId]?.name || "",
          amount: equalAmount,
        };
        return acc;
      }, {});
  
      setSplitWith(updatedSplitWith);
    }
  
    if (Object.keys(paidBy).length === 1) {
      const payerId = Object.keys(paidBy)[0];
      updatedPaidBy[payerId] = {
        name: paidBy[payerId]?.name || "",
        amount: amount,
      };
    }
  
    formData = {
      ...values,
      paidBy: updatedPaidBy,
      splitwith: updatedSplitWith,
      splitType: activeKey === "1" ? "equally" : "unequally",
      group_id: group_id,
    };
  
    console.log("data:", formData);
  
    try {
      const response = await createGroupExpense(formData).unwrap();
      console.log(response);
      if (response?.success) {
        notification.success({
          message: "Expense Created",
          description: response.message,
          placement: "topRight",
        });
        setIsExpenseModalOpen(false);
      } else {
        throw new Error(response?.error || "Failed to create expense.");
      }
    } catch (error) {
      notification.error({
        message: "Error adding expense",
        description:
          error?.data?.error || "An unexpected error occurred. Please try again.",
        placement: "topRight",
      });
      console.error("Error adding expense:", error);
    }
  };
  


  const handleValidation = () => {
    if (!amount) {
      form.setFields([
        {
          name: "amount",
          errors: ["Please fill in the amount before proceeding."],
        },
      ]);
      return false;
    } else if (amount === "0") {
      form.setFields([
        {
          name: "amount",
          errors: ["Amount should be > 0 before proceeding."],
        },
      ]);
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      {isWhoPaidModalOpen && (
        <WhoPaidModal
          isWhoPaidModalOpen={isWhoPaidModalOpen}
          setIsWhoPaidModalOpen={setIsWhoPaidModalOpen}
          updatePaidBy={updatePaidBy}
          paidBy={paidBy}
          setPaidBy={setPaidBy}
          amount={amount}
        />
      )}
      {adjustSplitModal && (
        <AdjustSplitModal
          isAdjustSplitModalOpen={adjustSplitModal}
          setIsAdjustSplitModalOpen={setAdjustSplitModal}
          splitwith={splitwith}
          setSplitWith={setSplitWith}
          amount={amount}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
          memberDetailsArray={memberDetailsArray}
        />
      )}
      <Modal
        title={
          <div className="bg-[#111418] p-4 pb-0 flex items-center justify-between">
            <h2 className="!leading-tight !tracking-[-0.015em] !text-xl font-bold">
              Add an expense
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={() => setIsExpenseModalOpen(false)}
              className="text-white hover:bg-transparent"
            />
          </div>
        }
        open={isAddExpenseModalOpen}
        onCancel={() => setIsExpenseModalOpen(false)}
        footer={null}
        style={{
          backgroundColor: "#111418",
          top: 0,
          margin: 0,
          maxWidth: "100vw",
          maxHeight: "100vh",
          height: "100vh",
        }}
        className="expense-modal"
        closable={false}
        maskClosable={false}
      >
        <div className="space-y-4 p-4 pt-0 ">
          <Form
            form={form} // Connect form instance here
            className=""
            initialValues={{
              splitOptions: "split_equally",
            }}
            onFinish={onFinish}
          >
            <div className="p-0">
              <Form.Item
                label="Expense Name"
                name="name"
                rules={[{ required: true }]}
                className="!mb-2"
              >
                <Input
                  placeholder="What is the expense for?"
                  value={expense}
                  onChange={(e) => setExpense(e.target.value)}
                  className=" h-10 !bg-[#283039] text-white !placeholder-[#9caaba] !border-none"
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true }]}
                className="!mb-2"
              >
                <Input
                  placeholder="₹ 0"
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^(?!0\d)\d*$/.test(value) && value !== "0") {
                      setAmount(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === ".") {
                      e.preventDefault();
                    }
                  }}
                  className="h-10 !bg-[#283039] text-white !placeholder-[#9caaba] !border-none"
                />

              </Form.Item>
            </div>
          </Form>

          <div className="flex items-center gap-4 bg-custom min-h-[72px] py-1">
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="!leading-tight !tracking-[-0.015em] !text-lg font-semibold py-5">
                Paid by
              </h1>
              <div
                className={`flex items-center justify-between ${
                  !amount ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() => {
                  handleValidation() === true
                    ? setIsWhoPaidModalOpen(true)
                    : "";
                }}
              >
                <p className="text-gray text-sm leading-normal line-clamp-1">
                  {Object.keys(paidBy).length === 1
                    ? paidBy[Object.keys(paidBy)[0]]?.name
                    : "Multiple People"}
                </p>
                <RightOutlined className="text-gray text-sm" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-custom min-h-[72px] py-1">
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="!leading-tight !tracking-[-0.015em] !text-lg font-semibold py-5">
                Split
              </h1>
              <div
                className={`flex items-center justify-between ${
                  !amount ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={() => {
                  handleValidation() === true ? setAdjustSplitModal(true) : "";
                }}
              >
                <p className="text-gray text-sm leading-normal line-clamp-1">
                  {activeKey == '1' ? "Equally" : "Unequally"}
                </p>
                <RightOutlined className="text-gray text-sm" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Button
            className="!bg-[#B57EDC] !border-[#283039] w-full"
            htmlType="submit"
            onClick={() => form.submit()}
          >
            Add Expense
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddExpenseModal;
