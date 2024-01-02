'use client'
import './styles.css'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from "@tiptap/extension-underline"
import React, {useState, useEffect, useRef} from 'react'
import {FaBold, FaItalic, FaListOl, FaQuoteLeft, FaStrikethrough, FaHeading, FaListUl, FaUndo, FaRedo, FaUnderline, FaDownload} from "react-icons/fa"


const downloadPDF = async (editor, documentName, margins) => {
  const html = editor.getHTML(); // Get HTML from the editor
  const res = await fetch('/api/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ html, documentName, margins }), // Include margins in the request body
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${documentName}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const MarginForm = ({ onSave, onClose, margins, setMargins }) => {
  // const [margins, setMargins] = useState({ top: '2rem', right: '2rem', bottom: '2rem', left: '2rem' });

  const handleMarginChange = (e) => {
    setMargins({ ...margins, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <input type="text" name="top" value={margins.top} onChange={handleMarginChange} placeholder="Top Margin" />
      <input type="text" name="right" value={margins.right} onChange={handleMarginChange} placeholder="Right Margin" />
      <input type="text" name="bottom" value={margins.bottom} onChange={handleMarginChange} placeholder="Bottom Margin" />
      <input type="text" name="left" value={margins.left} onChange={handleMarginChange} placeholder="Left Margin" />
      <button onClick={() => onSave(margins)}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

const MenuBar = ( {documentName, onMarginChange, margins} ) => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className='menu-bar'>
      <div>
      <button onClick={() => downloadPDF(editor, documentName, margins)}><FaDownload/></button>
      <button onClick={onMarginChange}>Adjust Margins</button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <FaBold/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <FaItalic/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleUnderline()
            .run()
        }
        className={editor.isActive('underline') ? 'is-active' : ''}
      >
        <FaUnderline/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <FaStrikethrough/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <FaHeading/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <FaListUl/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <FaListOl/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <FaQuoteLeft/>
      </button>
      </div>
      <div>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        <FaUndo/>
      </button>
      
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        <FaRedo/>
      </button>
    </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Underline
]

const content = `

`

const MyEditor = ({ documentName }) => {
  const [showMarginForm, setShowMarginForm] = useState(false);
  const [margins, setMargins] = useState({ top: '2rem', right: '2rem', bottom: '2rem', left: '2rem' });
  const editorRef = useRef(null); 

  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.classList?.contains('ProseMirror') && node.classList?.contains('tiptap')) {
              setEditorMargins(margins);
            }
          });
        }
      });
    });

    if (editorRef.current) {
      observer.observe(editorRef.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect(); // Cleanup observer on component unmount
      console.log('disconnecting observer');
    };
  }, [margins]); // Adding margins as a dependency

  const setEditorMargins = (newMargins) => {
    const editorElement = document.querySelector('.tiptap.ProseMirror');
    if (editorElement) {
      editorElement.style.setProperty('--editor-margin-top', newMargins.top);
      editorElement.style.setProperty('--editor-margin-right', newMargins.right);
      editorElement.style.setProperty('--editor-margin-bottom', newMargins.bottom);
      editorElement.style.setProperty('--editor-margin-left', newMargins.left);
    }
  };

  const handleMarginChange = (newMargins) => {
    setMargins(newMargins);
    setEditorMargins(newMargins);
    setShowMarginForm(false);
  };

  return (
    <div ref={editorRef} className="text-editor">
      {showMarginForm && <MarginForm onSave={handleMarginChange} margins={margins} setMargins={setMargins} onClose={() => setShowMarginForm(false)} />}
      <EditorProvider slotBefore={<MenuBar documentName={documentName} onMarginChange={() => setShowMarginForm(true)} margins={margins} />} extensions={extensions} content={content} onUpdate={({ editor }) => { /* ... */ }}></EditorProvider>
    </div>
  );
};

export default MyEditor;