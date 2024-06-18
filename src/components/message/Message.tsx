import React from 'react';
import { MessageProps } from '../../types/types';
import './Message.scss';

const Message: React.FC<MessageProps> = ({ role, content, renderMessageContent }) => {
  return (
    <div className={`message ${role}`}>
      <div className="message-content">
        <h3>{role}</h3>
        <div>{renderMessageContent(content)}</div>
      </div>
    </div>
  );
};

export default Message;
