'use client'
import React, { useState } from 'react';
import styles from './headerstyles.css';

function Header( {documentName, setDocumentName} ) {

  const handleNameChange = (e) => {
    setDocumentName(e.target.value);
  };

  return (
    <div className='header-main'>
      <div className='header-container'>
        <div className='home'>Home</div>
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
      <div className='right'>
        {/* Other right side content */}
      </div>
    </div>
  );
}

export default Header;
