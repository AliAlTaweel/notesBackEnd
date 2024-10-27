require("dotenv").config(); // Ensure this is called as a function
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors"); // Uncomment this to use CORS
const Note = require('./models/note')


const app = express();
const PORT = process.env.VITE_PORT || 3003;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static("dist"));
app.use(morgan("tiny")); // Use morgan logging middleware for requests


// Get all notes
app.get("/api/notes", (req, res) => {
  Note.find({})
    .then((notes) => {
      res.json(notes);
    })
    .catch((error) => {
      res.status(500).json({ error: "Could not retrieve notes" });
    });
});

// Get info about notes
app.get('/api/info', async (req, res) => {
  const notes = await Note.find({});
  res.send(`Notes has info for ${notes.length} notes <br/><br/>${new Date()}.`);
});

// Get note by ID
app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ error: 'No such note!' });
      }
    })
    .catch((error) => res.status(400).json({ error: 'Malformatted ID' }));
});

// Delete note by ID
app.delete('/api/notes/:id', (req, res) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => res.status(400).json({ error: 'Malformatted ID' }));
});

// Generate a new ID
const generateId = () => {
  const maxId =
    Note.length > 0 ? Math.max(...Note.map((note) => note.id)) : 0;
  return maxId + 1;
};

// Create a new note
app.post('/api/notes', (req, res) => {
  const { content, important } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required!' });
  }

  const newNote = new Note({
    content,
    important: important || false,
  });

  newNote.save()
    .then((savedNote) => res.status(201).json(savedNote))
    .catch((error) => res.status(400).json({ error: 'Error saving note' }));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
