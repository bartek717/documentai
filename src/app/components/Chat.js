'use client'
import React, { useState, useEffect } from 'react';
import './chatstyles.css';

function Chat() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUserMessage = { text: inputText, sender: 'user' };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
  
    setInputText('');
  
    await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: updatedMessages })
      })
      .then(async (response) => {
        const reader = response.body?.getReader();
        let currentChunk = '';

        while (true) {
          const { done, value } = await reader?.read();
          if (done) break;
          currentChunk += new TextDecoder().decode(value);
          setMessages(currentMessages => {
            const newMessages = [...currentMessages];
            if (newMessages.length > 0) {
              const lastMessageIndex = newMessages.length - 1;
              if (newMessages[lastMessageIndex].sender === 'user') {
                newMessages.push({ text: currentChunk, sender: 'gpt4' });
              } else {
                newMessages[lastMessageIndex].text = currentChunk;
              }
            }
            return newMessages;
          });
        }
      });
  };

  return (
    <div className='main-chat'>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
