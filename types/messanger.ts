export interface MessageItem {
  id: string;
  messageId: string;
  sender: "user" | "admin";
  content: string;
  createdAt: Date | string;
}

export interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string | null;
  status: "unread" | "read" | "replied";
  createdAt: Date | string;
  items: MessageItem[]; // Dodajemo ovo
}

export interface NewMsgState {
  to: string;
  subject: string;
  content: string;
}