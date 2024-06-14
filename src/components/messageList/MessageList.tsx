// src/components/messageList/MessageList.tsx
import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, latestMessageRef]);

  return (
    <div className="chat-messages">
      <h2>Welcome to The Beautiful Game Chatbot</h2>
      <p>Ask about any football player, and I will provide you with a detailed essay in the style of Ernest Hemingway.</p>
      {messages.map((message, index) => (
        <div key={index} ref={index === messages.length - 1 ? latestMessageRef : null}>
          <Message
            role={message.role}
            content={index === messages.length - 1 && message.role === 'assistant' ? typedText : message.content}
            renderMessageContent={renderMessageContent}
          />
        </div>
      ))}
      {isLoading && <div className="spinner"></div>}
    </div>
  );
};

export default MessageList;
