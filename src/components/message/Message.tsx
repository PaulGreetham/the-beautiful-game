// src/components/message/Message.tsx
import React, { useRef, useEffect } from 'react';
import { MessageProps } from '../../types/types';
import './Message.scss';

const Message: React.FC<MessageProps> = ({ role, content, renderMessageContent }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  // Scroll into view when the message content changes
  useEffect(() => {
    if (role === 'assistant' && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content, role]);

  return (
    <div className={`message ${role}`} ref={messageRef}>
      <div className="message-content">
        <h3>{role}</h3>
        <div>{renderMessageContent(content)}</div>
      </div>
    </div>
  );
};

export default Message;
