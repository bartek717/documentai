import React, { useState } from 'react';
import styles from './headerstyles.css';

function Header({ documentName, setDocumentName, pdfText, setPdfText }) {
  const handleNameChange = (e) => {
    setDocumentName(e.target.value);
  };

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
          type="file" 
          accept="text/plain" 
          onChange={handleFileUpload} 
          placeholder="Upload a .txt for context"
        />
      </div>
    </div>
  );
}

export default Header;
