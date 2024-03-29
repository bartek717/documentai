'use client'
import React, { useState } from 'react';
import './chatstyles.css';

function Chat( { text: pdfText, apiKey: apiKey} ) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUserMessage = { text: inputText, sender: 'user' };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputText('');
    const response = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ extra:pdfText, messages: updatedMessages, apiKey: apiKey })
      })
    if (!response.ok) {
      const errorData = await response.text(); // Get text response for debugging
      console.error('Server responded with error:', errorData);
      alert('Error occurred while saving API Key. Please check the console for more details.');
      return;
    }
    
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
      
      
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className='main-chat'>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-bubble ${message.sender}`}>
            <div className="message-text">{message.text}</div>
            <button className="copy-button" onClick={() => handleCopy(message.text)}>Copy</button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className='messageBox'
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;

