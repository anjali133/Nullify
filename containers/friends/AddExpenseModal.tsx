import React, { useState } from "react";
import {
  Modal,
  Input,
  DatePicker,
  Radio,
  Button,
  Form,
  ConfigProvider,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useAddExpenseMutation } from "@/provider/redux/services/user";
import dayjs from "dayjs";

interface AddExpenseModalProps {
  isAddExpenseModalOpen: boolean;
  setIsExpenseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  friendData: any;
  loggedInUserId: any;
  pathId: string;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isAddExpenseModalOpen,
  setIsExpenseModalOpen,
  friendData,
  loggedInUserId,
  pathId
}) => {
 // console.log(pathId);
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedSplitOption, setSelectedSplitOption] =
    useState("split_equally");
    const [addExpense, { isLoading }] = useAddExpenseMutation();

  const onFinish = async (values: any) => {
    const formattedDate = dayjs(values.date).toISOString(); // Convert to ISO-8601 string
    const totalAmount = parseFloat(values.total_amount);
    let paidBy = loggedInUserId;
    let splitDetails: any = {};

    if (
      values.split_type === "xyz_split_equally" ||
      values.split_type === "xyz_owed_full"
    ) {
      paidBy = friendData.user_id;
    }

    const splitAmount = values.split_type.includes("equally")
      ? totalAmount / 2
      : totalAmount;

    splitDetails =
      values.split_type === "xyz_split_equally" ||
      values.split_type === "xyz_owed_full"
        ? {
            [loggedInUserId]: {
              amount: totalAmount,
              is_settled: false,
            },
          }
        : {
            [friendData.user_id]: {
              amount: splitAmount,
              is_settled: false,
            },
          };

    const expenseData = {
      name: values.name,
      total_amount: totalAmount,
      split_type: selectedSplitOption,
      paid_by: paidBy,
      split_details: splitDetails,
      date: formattedDate,
      friendship_id: parseInt(pathId, 10),
    };

   // console.log("Final Expense Data:", expenseData);

    try {
      const response = await addExpense(expenseData).unwrap();
     // console.log("Expense saved:", response);
      setIsExpenseModalOpen(false);
    } catch (error) {
      console.error("Error saving expense:", error);
    }
    setIsExpenseModalOpen(false);
  };

  const friendsSplitOptions = [
    { value: "split_equally", label: "You paid, split equally" },
    { value: "owed_full", label: "You are owed the full amount" },
    {
      value: "xyz_split_equally",
      label: `${friendData?.name || "Friend"} paid, split equally`,
    },
    {
      value: "xyz_owed_full",
      label: `${friendData?.name || "Friend"} is owed the full amount`,
    },
  ];

  return (
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
      <div className="space-y-4 p-4 pt-0">
        <Form
          initialValues={{
            splitOptions: "split_equally",
          }}
          onFinish={onFinish}
        >
          <div className="p-0">
            <Form.Item
              label="Expense"
              name="name"
              rules={[{ required: true }]}
              className="!mb-2"
            >
              <Input
                placeholder="Enter a name"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                className=" h-10 !bg-[#283039] text-white !placeholder-[#9caaba] !border-none"
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              label="Amount"
              name="total_amount"
              rules={[{ required: true }]}
              className="!mb-2"
            >
              <Input
                placeholder="$0.00"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 !bg-[#283039] text-white !placeholder-[#9caaba] !border-none"
              />
            </Form.Item>
          </div>

          <ConfigProvider
            theme={{
              components: {
                DatePicker: {
                  colorBgContainer: "#283039",
                  colorTextHeading: "black",
                  colorBgBase: "#9caaba",
                  colorText: "black",
                  colorPrimaryText: "white",
                  colorTextPlaceholder: "#9caaba",
                  borderRadius: 6,
                  controlHeight: 32,
                  colorBorder: "transparent",
                  colorPrimaryHover: "#0b6cda",
                  colorPrimary: "#0b6cda",
                  algorithm: true,
                },
              },
            }}
          >
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true }]}
              className="!mb-6"
            >
              <DatePicker
                placeholder="Select a date"
                className="h-10 w-full !bg-[#283039] !text-white !border-none "
                format="YYYY-MM-DD"
                inputReadOnly
              />
            </Form.Item>
          </ConfigProvider>

          <Form.Item
            label={
              <h3 className="!leading-tight !tracking-[-0.015em] !text-lg font-bold mb-3">
                Split the payment
              </h3>
            }
            name="split_type"
            className="!mb-2"
          >
            <Radio.Group className="w-full space-y-3" onChange={(e) => setSelectedSplitOption(e.target.value)} >
              {friendsSplitOptions.map(({ value, label }) => (
                <Radio
                  key={value}
                  value={value}
                  className="!items-center h-10 !text-sm w-full border border-solid border-[#3b4754] bg-transparent text-transparent rounded-lg !pl-3 text-white"
                >
                  {label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item label={null}>
            <Button
              type="primary"
              className="w-full h-12 mt-4"
              htmlType="submit"
            >
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddExpenseModal;
