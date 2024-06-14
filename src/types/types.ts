export interface Message {
  role: string;
  content: string;
}

export interface MessageListProps {
  messages: Message[];
  renderMessageContent: (content: string) => JSX.Element[];
  isLoading: boolean;
  latestMessageRef: React.RefObject<HTMLDivElement>;
  typedText: string;
}

export interface MessageProps {
  role: string;
  content: string;
  renderMessageContent: (content: string) => JSX.Element[];
}

export interface ChatInputProps {
  handleSendMessage: (messageContent: string) => void;
  isTyping: boolean;
}
