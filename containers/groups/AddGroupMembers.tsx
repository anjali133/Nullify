import React, { useState, useCallback } from "react";
import { Avatar, Button, List, Modal, Space, Input, Spin } from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import CreateGroupModal from "./CreateGroupModal";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useFetchFriendshipQuery } from "@/provider/redux/services/user";
import { User, Friend } from "@/type";

interface AddGroupMembersProps {
  isAddGroupMembersOpen: boolean;
  setIsAddGroupMembersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SelectedFriendsProps {
  id: string;
  name: string;
}

const AddGroupMembers: React.FC<AddGroupMembersProps> = ({
  isAddGroupMembersOpen,
  setIsAddGroupMembersOpen,
}) => {
  const { Search } = Input;
  // const { user, isLoading } = useUser();
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
  const userId = user?.sub?.split("|")[1];

  const {
    data: friends = [],
    refetch,
    isFetching,
  } = useFetchFriendshipQuery(userId || "", { skip: !userId });
  const [selectedFriends, setSelectedFriends] = useState<
    SelectedFriendsProps[]
  >([]);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const handleSelectFriend = useCallback((friend: Friend) => {
    const friendId =
      friend.user_id1 !== userId ? friend.user_id1 : friend.user_id2;
    setSelectedFriends((prevSelected: SelectedFriendsProps[]) => {
      const isAlreadySelected = prevSelected.some(
        (selected) => selected.id === friendId
      );
      if (isAlreadySelected) {
        return prevSelected.filter((selected) => selected.id !== friendId);
      } else {
        return [
          ...prevSelected,
          {
            id: friendId,
            name: friend.name,
          },
        ];
      }
    });
  }, []);

  const onSearch = (value: string) => console.log(value);
  return (
    <div>
      {showCreateGroupModal && (
        <CreateGroupModal
          selectedFriends={selectedFriends}
          isCreateGroupModalOpen={showCreateGroupModal}
          setIsCreateGroupModalOpen={setShowCreateGroupModal}
          setIsAddGroupMembersOpen={setIsAddGroupMembersOpen}
        />
      )}
      <Modal
        title={
          <div className="bg-[#111418] p-4 pb-0 flex items-center justify-between">
            <h2 className="!leading-tight !tracking-[-0.015em] !text-lg font-bold">
              Add Group Members
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white" />}
              onClick={() => setIsAddGroupMembersOpen(false)}
              className="text-white hover:bg-transparent"
            />
          </div>
        }
        open={isAddGroupMembersOpen}
        onCancel={() => setIsAddGroupMembersOpen(false)}
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
          <div className="custom-input py-5">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Search
                placeholder="Search your friends..."
                allowClear
                onSearch={onSearch}
              />
            </Space>
          </div>
          {isFetching ? (
            <div className="flex justify-center mt-10">
              <Spin size="large" />
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={friends.filter(
                (friend: Friend) => friend.status !== "declined"
              )}
              renderItem={(friend: Friend) => (
                <List.Item
                  onClick={() => handleSelectFriend(friend)}
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
                    </div>
                  </div>

                  {selectedFriends.some(
                    (selected) =>
                      selected.id === friend.user_id1 ||
                      selected.id === friend.user_id2
                  ) && <CheckOutlined className="text-green-500 text-lg" />}
                </List.Item>
              )}
            />
          )}
        </div>
        <div className="p-6 flex justify-end">
          <Button
            className="!bg-[#B57EDC] !border-[#283039]"
            onClick={() => setShowCreateGroupModal(true)}
            disabled={selectedFriends.length === 0}
          >
            Next
            <ArrowRightOutlined />
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddGroupMembers;
