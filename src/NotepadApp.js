import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');

  // Load notes from localStorage when the app loads
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = () => {
    if (noteText.trim() === '') return;
    const newNote = { id: Date.now(), text: noteText };
    setNotes([...notes, newNote]);
    setNoteText('');  // Clear input field after adding the note
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Saved Notes</h2>
        <ul className="sidebar-list">
          {notes.length > 0 ? (
            notes.map((note) => (
              <li key={note.id} className="sidebar-item">
                {note.text.slice(0, 30) || 'Untitled Note'}
              </li>
            ))
          ) : (
            <li className="sidebar-item-empty">No saved notes available.</li>
          )}
        </ul>
      </div>

      <div className="main-content">
        <h1 className="app-title">Simple Notepad</h1>
        
        <textarea
          className="note-input"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write a note..."
        />
        
        <button onClick={addNote} className="add-button">Add Note</button>

        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note.id} className="note-item">
              {note.text}
              <button
                onClick={() => deleteNote(note.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
