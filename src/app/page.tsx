import Image from 'next/image';
import TipTap from './components/TipTap';
import Chat from './components/Chat';
import './styles.css';

export default function Home() {
  return (
    
    <div className="main">
      <div className="component" style={{ flex: '0 0 70%' }}>
        <TipTap></TipTap>
      </div>
      <div className="component" style={{ flex: '0 0 30%' }}>
        <Chat></Chat>
      </div>
    </div>
    
  );
}