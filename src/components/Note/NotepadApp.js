import React, { useState, useEffect } from 'react';

// Simple SVG icon component for the sidebar toggle
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// Note component
const Note = ({ note, updateText, deleteNote }) => {
  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const monthNames = ["Jan", "Feb", "March", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let hrs = date.getHours();
    let amPm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs ? hrs : "12";
    hrs = hrs > 12 ? (hrs = 24 - hrs) : hrs;
    let min = date.getMinutes();
    min = min < 10 ? "0" + min : min;
    let day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${hrs}:${min} ${amPm} ${day} ${month}`;
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
    <div className="bg-white rounded-lg shadow-md p-4 mb-4" style={{ backgroundColor: note.color }}>
      <textarea
        className="w-full h-32 p-2 mb-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue={note.text}
        onChange={(event) => debouncedUpdateText(event.target.value, note.id)}
      />
      <div className="flex justify-between items-center text-sm text-gray-600">
        <p>{formatDate(note.time)}</p>
        <button
          onClick={() => deleteNote(note.id)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Main NotepadApp component
const NotepadApp = () => {
  const [notes, setNotes] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: "",
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
    const colors = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white w-64 p-4 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out fixed h-full z-20`}>
        <h2 className="text-xl font-bold mb-4">Saved Notes</h2>
        <ul>
          {notes.map(note => (
            <li key={note.id} className="mb-2 truncate">
              <a href={`#note-${note.id}`} className="text-blue-600 hover:text-blue-800">
                {note.text.slice(0, 30) || "Empty note"}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 ml-0 md:ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notepad App</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <MenuIcon />
          </button>
        </div>
        <button
          onClick={addNote}
          className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Note
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <Note
              key={note.id}
              note={note}
              updateText={updateText}
              deleteNote={deleteNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotepadApp;