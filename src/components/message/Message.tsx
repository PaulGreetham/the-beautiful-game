// src/components/message/Message.tsx
import React from 'react';
import { MessageProps } from '../../types/types';
import './Message.scss';

const Message: React.FC<MessageProps> = ({ role, content, renderMessageContent }) => {
  console.log('Rendering Message:', { role, content }); // Debug props

  return (
    <div className={`message ${role}`}>
      <h3>{role}</h3>
      <div>{renderMessageContent(content)}</div>
    </div>
  );
};

export default Message;
