import React, { useState } from 'react';
import axios from 'axios';
import './ChatBox.scss';

const ChatBox: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    {
      role: 'system',
      content: "You're like a grammar-checking wizard, helping users fix grammar bloopers and jazz up their sentence structures.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  console.log('API_KEY:', API_KEY);  // Debug: Check if API key is being accessed

  const handleSendMessage = async (messageContent: string) => {
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: messageContent }]);
    setIsTyping(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [...messages, { role: 'user', content: messageContent }],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      console.log(response.data);  // Debug: Log the response data

      const botMessage = response.data.choices[0].message.content;
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: botMessage }]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching response from OpenAI:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }

    setIsTyping(false);
  };

  return (
    <>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <h3>{message.role}</h3>
            <p>{message.content}</p>
          </div>
        ))}
        {isTyping && <p>Bot is typing...</p>}
      </div>
      <form
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
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping}>Send</button>
      </form>
    </>
  );
};

export default ChatBox;
