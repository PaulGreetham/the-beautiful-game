import React from 'react';
import ChatBox from './components/ChatBox';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with OpenAI</h1>
      </header>
      <ChatBox />
    </div>
  );
};

export default App;
