interface User {
  user_id1: string;
  user_id2: string;
  email: string;
  name: string;
  status?: string;
  avatarColor?: string;
  friendship_id?: string;
}

interface Friend {
  id?: string;
  user_id1: string;
  user_id2: string;
  name: string;
  status?: string;
  amount?: string;
  avatarColor?: string;
}

interface Group {
  group_id: string;
  name: string;
  simplify_debt: boolean;
  member_details: GroupMemberDetails;
  status: string;
  amount: number;
}

interface GroupMemberDetails {
  [key: string]: {
    amount: number;
  };
}

interface Expense {
  id: string;
  name: string;
  date: string;
  paid_by: string;
  total_amount: number;
  split_details: any;
}

interface PaymentDetails {
  name: string;
  amount: number;
}

interface Settlement {
  user1: string;
  user2: string;
  amount: any;
};

export type { User, Friend, GroupMemberDetails, Group, Expense, PaymentDetails, Settlement };


