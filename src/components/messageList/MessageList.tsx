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
      <h2>Elevating the beautiful game to new heights through AI</h2>
      <p>Dive into the rich histories and stories of football's greatest players. Input the name of any player, and receive an eloquent, in-depth essay celebrating their achievements and legacy - all in the style of some of the great literary giants of the 20th Centruy.</p>
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
