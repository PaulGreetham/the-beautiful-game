import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBox.scss';
import { useTypingEffect } from '../hooks/useTypingEffect';

const ChatBox: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    {
      role: 'system',
      content: "You are an assistant who writes essays about football players in the style of Ernest Hemingway. The essay should be 500 words long, focusing on the player's main achievements, the main teams of their career, their positions, statistics, and other informative information.",
    },
    {
      role: 'assistant',
      content: 'Which player would you like information on?',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const latestMessageRef = useRef<HTMLDivElement>(null);

  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  const handleSendMessage = async (messageContent: string) => {
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: messageContent }]);
    setIsTyping(true);
    setIsLoading(true);

    try {
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
          ...messages,
          { role: 'user', content: `Write a 500 word essay about the football player ${messageContent}, in the style of Ernest Hemingway. The essay should be 500 words long, focusing on the player's main achievements, the main teams of their career, their positions, statistics, and other informative information.` }
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
        setCurrentMessage(botMessage);
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
    setIsLoading(false);
  };

  // Use typing effect for the current message, with twice the speed
  const typedText = useTypingEffect(currentMessage, 25); // Adjust the speed parameter as needed

  useEffect(() => {
    if (currentMessage) {
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: currentMessage }]);
    }
  }, [currentMessage]);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="paragraph">{paragraph}</p>
    ));
  };

  return (
    <div className="chat-container">
      <header className="App-header">
        <h1>The Beautiful Game</h1>
      </header>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role}`}
            ref={index === messages.length - 1 ? latestMessageRef : null}
          >
            <h3>{message.role}</h3>
            <div>{index === messages.length - 1 && message.role === 'assistant' ? renderMessageContent(typedText) : renderMessageContent(message.content)}</div>
          </div>
        ))}
        {isLoading && <div className="spinner"></div>}
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
