'use client'
import React, { useState } from 'react';
import styles from './headerstyles.css';

function Header({ documentName, setDocumentName, pdfText, setPdfText, apiKey, setApiKey }) {
  const [tempApiKey, setTempApiKey] = useState('');
  const handleNameChange = (e) => {
    setDocumentName(e.target.value);
  };

  const handleChangeApiKey = (e) => {
    setTempApiKey(e.target.value);
  }

  const saveApiKey = (key) =>{
    setApiKey(key);
    setTempApiKey('')
    alert('API Key saved successfully!');
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      try {
        const reader = new FileReader();
        reader.onload = function(e) {
          const text = e.target.result;
          
          setPdfText(text);
        };
        reader.readAsText(file);
        
      } catch (error) {
        console.error('Error reading file:', error);
      }
    } else {
      console.error('Please upload a text file.');
    }
    alert('File Uploaded Succesfully')
  };

  return (
    <div className='header-main'>
      <div className='header-container'>
        <div className='document-name'>
          <input 
            type="text" 
            value={documentName} 
            onChange={handleNameChange} 
            className="document-name-input" 
            placeholder="Enter document name" 
          />
        </div>
      </div>
      <div className='logoContainer'>
        <img src='DocAI.png' alt='logo' className='logo' />
      </div>
      <div className='right'>
        <input 
            type="text" 
            value={tempApiKey} 
            onChange={handleChangeApiKey} 
            className="document-name-input" 
            placeholder="Paste Your GPT API key" 
        />
        <button className='custom-file-upload' onClick={() => saveApiKey(tempApiKey)}>Save</button>
        <input 
          type="file" 
          accept="text/plain" 
          onChange={handleFileUpload} 
          id="fileInput" 
          style={{ display: 'none' }} 
        />
        <label htmlFor="fileInput" className="custom-file-upload">
          Upload a .txt file
        </label>
      </div>

    </div>
  );
}

export default Header;
