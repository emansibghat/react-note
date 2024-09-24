import React, { useState, useEffect } from 'react';
import './NotepadApp.css';

// Menu Icon Component
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// Note Component
const Note = ({ note, updateText, deleteNote }) => {
  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let hrs = date.getHours();
    let amPm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs ? hrs : '12';
    hrs = hrs > 12 ? (hrs = 24 - hrs) : hrs;
    let min = date.getMinutes();
    min = min < 10 ? '0' + min : min;
    let day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${hrs}:${min} ${amPm}, ${day} ${month}`;
  };

  const debounce = (func, delay = 500) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedUpdateText = debounce(updateText);

  return (
    <div className="note-card bg-white rounded-lg shadow-lg p-6 mb-4 hover:scale-105 transform transition-transform duration-300" style={{ backgroundColor: note.color }}>
      <textarea
        className="w-full h-40 p-4 mb-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        defaultValue={note.text}
        onChange={(event) => debouncedUpdateText(event.target.value, note.id)}
        placeholder="Write your note here..."
      />
      <div className="flex justify-between items-center text-sm text-gray-600">
        <p className="note-date">{formatDate(note.time)}</p>
        <button
          onClick={() => deleteNote(note.id)}
          className="delete-btn text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Main Notepad App Component
const NotepadApp = () => {
  const [notes, setNotes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to toggle sidebar visibility
  const [showNotes, setShowNotes] = useState(false); // State to control whether notes are displayed

  // Load notes from localStorage when the sidebar is opened
  const handleShowNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
    setShowNotes(true);
    setSidebarOpen(true); // Open the sidebar
  };

  // Save notes to localStorage when the notes array changes
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: '',
      color: getRandomColor(),
      time: Date.now(),
    };
    setNotes([newNote, ...notes]);
  };

  const updateText = (text, id) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, text, time: Date.now() } : note
    );
    setNotes(updatedNotes);
  };

  const deleteNote = (id) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
  };

  const getRandomColor = () => {
    const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`sidebar bg-gray-800 w-64 p-6 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out fixed h-full z-20 overflow-y-auto`}>
        <h2 className="text-xl font-bold mb-6 text-white">Saved Notes</h2>
        <ul className="space-y-3">
          {showNotes && notes.length > 0 ? (
            notes.map(note => (
              <li key={note.id} className="truncate">
                <a href={`#note-${note.id}`} className="text-gray-300 hover:text-gray-50 transition-colors duration-300">
                  {note.text.slice(0, 30) || 'Empty note'}
                </a>
              </li>
            ))
          ) : (
            <li className="text-gray-400">No saved notes available.</li>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-0 md:ml-64 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">My Notepad</h1>
          <button
            onClick={handleShowNotes}
            className="md:hidden p-2 rounded-md bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-colors duration-300"
          >
            <MenuIcon />
          </button>
        </div>
        <button
          onClick={addNote}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
        >
          +
        </button>
        {/* Display notes */}
        {showNotes && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <Note
                key={note.id}
                note={note}
                updateText={updateText}
                deleteNote={deleteNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotepadApp;
