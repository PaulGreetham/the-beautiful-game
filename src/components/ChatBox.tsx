import React, { useState } from 'react';
import axios from 'axios';
import './ChatBox.scss';
import { useTypingEffect } from '../hooks/useTypingEffect';

const ChatBox: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    {
      role: 'system',
      content: "You are an assistant who writes essays about football players in the style of Ernest Hemingway. The essay should be 2,000 words long, focusing on the player's main achievements, the main teams of their career, their positions, statistics, and other informative information.",
    },
    {
      role: 'assistant',
      content: 'Which player would you like information on?',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  const handleSendMessage = async (messageContent: string) => {
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: messageContent }]);
    setIsTyping(true);

    try {
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
          ...messages,
          { role: 'user', content: `Write a 2,000 word essay about the football player ${messageContent}.` }
        ],
        temperature: 0.7,
      };

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        const botMessage = response.data.choices[0].message.content;
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: botMessage }]);
        setCurrentMessage(botMessage); // Update current message for typing effect
      } else {
        setMessages((prevMessages) => [...prevMessages, { role: 'system', content: 'Error: No choices found in the response.' }]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          setMessages((prevMessages) => [...prevMessages, { role: 'system', content: 'Error: Rate limit exceeded. Please wait a moment and try again.' }]);
        } else if (error.response?.status === 401) {
          setMessages((prevMessages) => [...prevMessages, { role: 'system', content: 'Error: Unauthorized. Please check your API key.' }]);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, { role: 'system', content: 'Unexpected error occurred. Please try again later.' }]);
      }
    }

    setIsTyping(false);
  };

  // Use typing effect for the current message
  const typedText = useTypingEffect(currentMessage);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => {
          if (message.role === 'assistant') {
            return (
              <div key={index} className="message">
                <h3>{message.role}</h3>
                <p>{typedText}</p> {/* Display the typed text */}
              </div>
            );
          }
          return (
            <div key={index} className="message">
              <h3>{message.role}</h3>
              <p>{message.content}</p>
            </div>
          );
        })}
        {isTyping && <p className="bot-typing">Bot is typing...</p>}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          const inputMessage = input.trim();
          if (inputMessage !== '') {
            handleSendMessage(inputMessage);
            setInput('');
          }
        }}
        aria-label="Chat Input Form"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type the name of a football player..."
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
