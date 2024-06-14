import React, { useState } from 'react';
import { ChatInputProps } from '../../types/types';
import './ChatInput.scss';

const ChatInput: React.FC<ChatInputProps> = ({ handleSendMessage, isTyping }) => {
  const [input, setInput] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputMessage = input.trim();
    if (inputMessage !== '') {
      handleSendMessage(inputMessage);
      setInput('');
    }
  };

  return (
    <form className="chat-input" onSubmit={onSubmit} aria-label="Chat Input Form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type the name of a football player..."
        disabled={isTyping}
      />
      <button type="submit" disabled={isTyping}>Send</button>
    </form>
  );
};

export default ChatInput;
