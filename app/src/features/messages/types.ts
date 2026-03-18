import { User } from "@/types/user";

export type MessageParticipant = Pick<User, "id" | "first_name" | "last_name">;

export type ConversationSummary = {
  id: number | string;
  content?: string | null;
  created_at?: string | null;
  participants?: MessageParticipant[];
};
