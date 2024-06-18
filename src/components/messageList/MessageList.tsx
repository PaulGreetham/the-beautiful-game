// src/components/messageList/MessageList.tsx
import React, { useEffect, useRef } from 'react';
import Message from '../message/Message';
import { MessageListProps } from '../../types/types';
import './MessageList.scss';

const MessageList: React.FC<MessageListProps> = ({
  messages,
  renderMessageContent,
  isLoading,
  latestMessageRef,
  typedText,
}) => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, typedText]);

  return (
    <div className="chat-messages" ref={chatMessagesRef}>
      <h2>Elevating the beautiful game to new heights through AI</h2>
      <h4>Dive into the rich histories and stories of football's greatest players. Input the name of any player, and receive an eloquent, in-depth essay celebrating their achievements and legacy - all in the style of some of the great literary giants of the 20th Century.</h4>
      {messages.map((message, index) => (
        <div key={index} ref={index === messages.length - 1 ? latestMessageRef : null}>
          <Message
            role={message.role}
            content={message.role === 'assistant' && index === messages.length - 1 ? typedText : message.content}
            renderMessageContent={renderMessageContent}
          />
        </div>
      ))}
      {isLoading && <div className="spinner"></div>}
    </div>
  );
};

export default MessageList;
