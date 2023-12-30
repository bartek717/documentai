import Image from 'next/image';
import TipTap from './components/TipTap';
import Chat from './components/Chat';
import Header from './components/Header'
import './styles.css';

export default function Home() {
  return (
    

    <div>
      <div className='header'>
        <Header/>
        {/* <div>hi</div> */}
      </div>
      <div className="main">
        <div className="editor" style={{ flex: '0 0 70%' }}>
          <TipTap/>
        </div>
        <div className="component" style={{ flex: '0 0 30%' }}>
          <Chat></Chat>
        </div>
      </div>
    </div>
    
  );
}