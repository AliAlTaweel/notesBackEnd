require("dotenv").config(); // Ensure this is called as a function
const express = require("express");
const morgan = require("morgan");
const cors = require("cors"); // Uncomment this to use CORS

const app = express();
const PORT = process.env.PORT || 10000; // Move PORT declaration to the top

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Morgan 'tiny' logger for all requests
app.use(morgan("tiny")); // Use morgan logging middleware for requests

// Sample notes data
let notes = [
  { id: 1, content: 'HTML is easy', important: true },
  { id: 2, content: 'Browser can execute only JavaScript', important: false },
  { id: 3, content: 'GET and POST are the most important methods of HTTP protocol', important: true }
];

// Get all notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Get info about notes
app.get("/api/info", (req, res) => {
  res.send(`Notes has info for ${notes.length} notes <br/><br/>${new Date()}.`);
});

// Get note by ID
app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: "No such note!" });
  }
});

// Delete note by ID
app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id); // Ensure ID is a number
  notes = notes.filter(note => note.id !== id);
  res.status(204).end();
});

// Generate a new ID
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
  return maxId + 1;
};

// Create a new note
app.post("/api/notes", (req, res) => {
  const { content, important } = req.body;

  if (content === undefined || important === undefined) {
    return res.status(400).json({ error: "Content and importance are required!" });
  }
  if (notes.find(note => note.content === content)) {
    return res.status(400).json({ error: "Content must be unique!" });
  }

  const newNote = {
    id: generateId(),
    content,
    important,
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
