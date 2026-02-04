export interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  message: string;
  status: "unread" | "read" | "replied" | null;
  replyContent: string | null;
  repliedAt: Date | null;
  createdAt: Date | null;
}

export interface NewMsgState {
  to: string;
  subject: string;
  content: string;
}