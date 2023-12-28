'use client'
import React, { useState } from 'react';
import './chatstyles.css';

function Chat() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [ openAIResponse, setOpenAIResponse ] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add the user message to the messages array
    setMessages(messages => [...messages, { text: inputText, sender: 'user' }]);

    // Clear the input field immediately after submission
    setInputText('');

    // Make API call with inputText here
    await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: inputText })
      })
      .then(async (response) => {
        const reader = response.body?.getReader();
        setOpenAIResponse("");

        while (true) {
          const { done, value } = await reader?.read();
          if(done) break;
          var currentChunk = new TextDecoder().decode(value);
          
          // Update the messages array with the new chunk
          setOpenAIResponse((prev) => prev + currentChunk);
        }
      });
  };

  return (
    <div className='main-chat'>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={message.sender}>
            {message.text}
          </div>
        ))}
        <div>
            {openAIResponse}
        </div>
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
