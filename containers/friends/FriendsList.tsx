"use client";

import {
  Button,
  List,
  Typography,
  Avatar,
  Input,
  Space,
  Tooltip,
  Spin,
} from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AddMoreFriendsModal from "./AddMoreFriendsModal";
import {
  CheckOutlined,
  CloseOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  useCreateFriendshipMutation,
  useLazySearchUserByEmailQuery,
  useFetchFriendshipQuery,
  useAcceptFriendshipMutation,
  useDeclineFriendshipMutation,
} from "@/provider/redux/services/user";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getRandomColor } from "@/app/lib/constants";
import { User } from "@/type";

const { Title } = Typography;

const FriendsListPage = () => {
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
  const router = useRouter();

  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isAddMoreFriendsModalOpen, setIsAddMoreFriendsModalOpen] =
    useState(false);

  const [triggerSearch, { isLoading: isSearchLoading }] =
    useLazySearchUserByEmailQuery();
  const {
    data: friends = [],
    refetch,
    isFetching,
    // isLoading
  } = useFetchFriendshipQuery(userId || "", { skip: !userId });
  const [acceptFriendship] = useAcceptFriendshipMutation();
  const [declineFriendship] = useDeclineFriendshipMutation();

  useEffect(() => {
   // console.log(friends);
    if (!user) {
      router.push("/auth");
      return;
    }
  }, [user, router]);

  const onSearch = async (value: string) => {
    setSearchEmail(value);
    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await triggerSearch(value).unwrap();
      const filteredResults = response.filter(
        (result: User) => result.email !== user?.email
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleAccept = async (friendId: string) => {
    try {
      const userId1 = user?.sub?.split("|")[1];
      if (!userId1) {
        console.error("User ID not found");
        return;
      }

      await acceptFriendship({
        user_id1: friendId,
        user_id2: userId1,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleDecline = async (friendId: string) => {
    try {
      const userId1 = user?.sub?.split("|")[1];
      if (!userId1) {
        console.error("User ID not found");
        return;
      }

      await declineFriendship({
        user_id1: friendId,
        user_id2: userId1,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to decline friend request:", error);
    }
  };

  const handleFriendClick = (id: string) => {
    router.push(`/friends/${id}`);
  };

 // console.log(friends);

  return (
    <div className="bg-custom p-4 pt-0 flex-1">
      {isAddMoreFriendsModalOpen && (
        <AddMoreFriendsModal
          isAddMoreFriendsModalOpen={isAddMoreFriendsModalOpen}
          setIsAddMoreFriendsModalOpen={setIsAddMoreFriendsModalOpen}
        />
      )}
      <div className="flex items-center justify-between mt-[3.5rem] mb-6">
        <h1 className="text-[22px] text-[#fff] font-bold leading-tight tracking-[-0.015em]">
          Overall, you owe <span className="text-danger">$400.00</span>
        </h1>
        <Button
          onClick={() => setIsAddMoreFriendsModalOpen(true)}
          type="primary"
          icon={<UserAddOutlined />}
          className="!ml-4"
        />
      </div>

      <div className="custom-input py-5">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input.Search
            placeholder="Search Friends..."
            allowClear
            onSearch={onSearch}
            // loading={isSearchLoading || isFetching}
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
            (friend: User) => friend.status !== "declined"
          )}
          renderItem={(friend: User) => {
            const loggedInUserId = user?.sub?.split("|")[1];
            const isRecipient = friend.user_id2 === loggedInUserId;
            const randomColor = getRandomColor();

            return (
              <List.Item
                onClick={() =>
                  friend?.status !== "pending" &&
                  handleFriendClick(friend?.friendship_id || '')
                }
                className="cursor-pointer flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    style={{
                      backgroundColor: randomColor,
                      verticalAlign: "middle",
                    }}
                  >
                    {friend.name[0]?.toUpperCase()}
                  </Avatar>
                  <div>
                    <Tooltip title={friend.email}>
                      <p className="text-white text-[16px] leading-normal line-clamp-1">
                        {friend.name}
                      </p>
                    </Tooltip>
                    {friend.status === "pending" && (
                      <span className="text-gray">{friend.status}</span>
                    )}

                    {friend?.status !== "pending" && (
                      <p
                        className={`${
                          friend.status === "you owe"
                            ? "text-danger"
                            : "text-danger"
                        } text-sm leading-normal line-clamp-1`}
                      >
                        {friend.status === "you owe"
                          ? "Owes You"
                          : "You owe"}
                      </p>
                    )}
                  </div>
                </div>

                {friend.status === "pending" && isRecipient && (
                  <div className="ml-auto flex gap-2">
                    <Button
                      type="primary"
                      onClick={() => handleAccept(friend.user_id1)}
                    >
                      <CheckOutlined />
                    </Button>
                    <Button
                      danger
                      onClick={() => handleDecline(friend.user_id1)}
                    >
                      <CloseOutlined />
                    </Button>
                  </div>
                )}
                {friend.status !== "pending" && (
                  <p className="text-danger text-sm">$100</p>
                )}
              </List.Item>
            );
          }}
        />
      )}

      {/* {searchResults.length === 0 && searchEmail && (
        <p className="text-center text-white mt-4">No results found</p>
      )} */}
    </div>
  );
};

export default FriendsListPage;
