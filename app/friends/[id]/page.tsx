import FriendsViewPage from "@/containers/friends/FriendsView";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <FriendsViewPage pathId={id} />;
}
