import { Button, Form, Modal, Input, notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  useCreateFriendshipMutation,
  useLazySearchUserByEmailQuery,
} from "@/provider/redux/services/user";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

interface AddMoreFriendsModalProps {
  isAddMoreFriendsModalOpen: boolean;
  setIsAddMoreFriendsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface User {
  user_id: string;
  email: string;
  name: string;
  status?: string;
  avatarColor?: string;
}

const AddMoreFriendsModal: React.FC<AddMoreFriendsModalProps> = ({
  isAddMoreFriendsModalOpen,
  setIsAddMoreFriendsModalOpen,
}) => {
  const { user } = useUser();
  const [triggerSearch, { isLoading: isSearchLoading }] =
    useLazySearchUserByEmailQuery();
  const [createFriendship, { isLoading: isCreating }] =
    useCreateFriendshipMutation();
  const [noUsersFound, setNoUsersFound] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

  const onSearch = async () => {
    if (!searchEmail.trim()) {
      setSearchResults([]);
      setNoUsersFound(false);
      return;
    }

    try {
      const response = await triggerSearch(searchEmail).unwrap();
      console.log(response);

      const filteredResults = response.filter(
        (result: User) => result.email !== user?.email
      );
      if (filteredResults.length === 0) {
        setNoUsersFound(true);
      } else {
        setNoUsersFound(false);
      }
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching users:", error);
      setNoUsersFound(true);
    }
  };

  const onFinish = () => {
    console.log("Sending request to:", searchEmail);
    onSearch();
  };

  const handleFriendClick = (friend: User) => {
    setSelectedFriend(friend);
    setIsConfirmationModalVisible(true);
  };

  const handleSendRequest = async () => {
    if (!user || !selectedFriend) return;

    try {
      const userId1 = user.sub?.split("|")[1];
      if (!userId1) {
        console.error("User ID not found");
        return;
      }

      const response = await createFriendship({
        user_id1: userId1,
        user_id2: selectedFriend.user_id,
      }).unwrap();
      console.log(response);
      notification.success({
        message: "Friend request",
        description: response?.message,
        placement: "topRight",
      });
      setIsConfirmationModalVisible(false);
      setIsAddMoreFriendsModalOpen(false);
    } catch (error) {
      setIsConfirmationModalVisible(false);
      notification.error({
        message: "Error Sending Friend Request",
        description:
          error?.data?.error ||
          "An unexpected error occurred. Please try again.",
        placement: "topRight",
      });
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div>
      <Modal
        title={
          <div className="bg-[#111418] p-4 pb-0 flex items-center justify-between">
            <h2 className="!leading-tight !tracking-[-0.015em] !text-xl font-bold">
              Add your friend
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={() => setIsAddMoreFriendsModalOpen(false)}
              className="text-white hover:bg-transparent"
            />
          </div>
        }
        open={isAddMoreFriendsModalOpen}
        onCancel={() => setIsAddMoreFriendsModalOpen(false)}
        footer={null}
        style={{
          maxHeight: "50vh",
          height: "50vh",
          top: 120,
        }}
        className="expense-modal"
        closable={false}
      >
        <div className="bg-custom p-4 pt-0 flex-1 pb-10">
          <Form onFinish={onFinish}>
            <Form.Item
              label="Email Id"
              name="email_id"
              rules={[
                {
                  required: true,
                  message: "Please enter your friend's email.",
                },
              ]}
              className="!mb-2"
            >
              <Input
                placeholder="What is the email of your friend?"
                className="p-2 h-10 w-[100%] !bg-[#283039] text-white !placeholder-[#9caaba] !border-none rounded-md"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </Form.Item>
            <Button
              type="primary"
              className="w-full h-12 mt-4 mt-10"
              htmlType="submit"
              loading={isSearchLoading}
            >
              Search
            </Button>
          </Form>

          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-white mb-2">Search Results:</h3>
              <ul>
                {searchResults.map((result) => (
                  <li
                    key={result.user_id}
                    className="text-white mb-2 cursor-pointer"
                    onClick={() => handleFriendClick(result)} // Add click handler to show confirmation modal
                  >
                    {result.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {noUsersFound && !isSearchLoading && (
            <p className="text-center text-white mt-4">No users found</p>
          )}
        </div>
      </Modal>

      <Modal
        title={
          <div className="bg-[#111418] p-4 pb-0 flex items-center justify-between">
            <h2 className="!leading-tight !tracking-[-0.015em] !text-xl font-bold">
              Confirm Friend Request
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={() => setIsConfirmationModalVisible(false)}
              className="text-white hover:bg-transparent"
            />
          </div>
        }
        open={isConfirmationModalVisible}
        onCancel={() => setIsConfirmationModalVisible(false)}
        style={{
          maxHeight: "50vh",
          height: "50vh",
          top: 120,
          bottom: 120,
        }}
        className="expense-modal"
        closable={false}
        footer={[
          <Button
            key="yes"
            type="primary"
            onClick={handleSendRequest}
            className="mb-6 mr-6"
          >
            Yes
          </Button>,
        ]}
      >
        <div className="bg-custom p-4 pt-0 flex-1 pb-10">
          <p>Do you want to send a friend request to {selectedFriend?.name}?</p>
        </div>
      </Modal>
    </div>
  );
};

export default AddMoreFriendsModal;
