require("dotenv").config(); // Ensure this is called as a function
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors"); // Uncomment this to use CORS
const Note = require("./models/note");

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
app.get("/api/info", async (req, res) => {
  const notes = await Note.find({});
  res.send(`Notes has info for ${notes.length} notes <br/><br/>${new Date()}.`);
});

// Get note by ID
app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ error: "No such note!" });
      }
    })
    .catch((error) => res.status(400).json({ error: "Malformatted ID" }));
});

// Delete note by ID
app.delete("/api/notes/:id", (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Note not found" });
      }
    })
    .catch((error) => res.status(400).json({ error: "Malformatted ID" }));
});

// Generate a new ID
const generateId = () => {
  const maxId = Note.length > 0 ? Math.max(...Note.map((note) => note.id)) : 0;
  return maxId + 1;
};

// Create a new note
app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
  });

  newNote
    .save()
    .then((savedNote) => res.json(savedNote))
    .catch((error) => next(error));
});
//============= update Note ===========
app.put('/api/notes/:id', (request, response, next) => {

  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id, 

    { content, important },
    { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})
//============= errorHundler ===========
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
// =========== Start the server =========
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
