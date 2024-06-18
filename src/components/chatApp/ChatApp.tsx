// src/components/chatApp/ChatApp.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatApp.scss';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import MessageList from '../messageList/MessageList';
import ChatInput from '../chatInput/ChatInput';
import Header from '../header/Header';
import Spinner from '../spinner/Spinner';
import { Message } from '../../types/types';

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
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

  useEffect(() => {
    console.log('Initial Messages:', messages); // Debug initial messages
  }, [messages]);

  const handleSendMessage = async (messageContent: string) => {
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: messageContent }]);
    setIsTyping(true);
    setIsLoading(true);

    try {
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
          ...messages,
          {
            role: 'user',
            content: `Write a 500 word essay about the football player ${messageContent}, in the style of Ernest Hemingway. The essay should be 500 words long, focusing on the player's main achievements, the main teams of their career, their positions, statistics, and other informative information.`,
          },
        ],
        temperature: 0.7,
      };

      const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (response.data.choices && response.data.choices.length > 0) {
        const botMessage = response.data.choices[0].message.content;
        setCurrentMessage(botMessage);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'system', content: 'Error: No choices found in the response.' },
        ]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'system', content: 'Error: Rate limit exceeded. Please wait a moment and try again.' },
          ]);
        } else if (error.response?.status === 401) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'system', content: 'Error: Unauthorized. Please check your API key.' },
          ]);
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'system', content: 'Unexpected error occurred. Please try again later.' },
        ]);
      }
    }

    setIsTyping(false);
    setIsLoading(false);
  };

  const typedText = useTypingEffect(currentMessage);

  useEffect(() => {
    if (currentMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: currentMessage },
      ]);
    }
  }, [currentMessage]);

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="paragraph">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="chat-container">
      {isLoading && <Spinner />} {/* Conditionally render the Spinner as an overlay */}
      <Header />
      <MessageList
        messages={messages}
        renderMessageContent={renderMessageContent}
        isLoading={isLoading}
        latestMessageRef={latestMessageRef}
        typedText={typedText}
      />
      <ChatInput handleSendMessage={handleSendMessage} isTyping={isTyping} />
    </div>
  );
};

export default ChatApp;
