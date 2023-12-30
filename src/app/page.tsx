'use client'
import Image from 'next/image';
import TipTap from './components/TipTap';
import Chat from './components/Chat';
import Header from './components/Header'
import React, { useState } from 'react';
import './styles.css';

export default function Home() {
  const [documentName, setDocumentName] = useState('');
  return (
    <div className='master'>
      <div className='header'>
        <Header documentName={documentName} setDocumentName={setDocumentName} />
        {/* <div>hi</div> */}
      </div>
      <div className="main">
        <div className="editor" style={{ flex: '0 0 70%' }}>
          <TipTap documentName={documentName}/>
        </div>
        <div className="component" style={{ flex: '0 0 30%' }}>
          <Chat></Chat>
        </div>
      </div>
    </div>
    
  );
}