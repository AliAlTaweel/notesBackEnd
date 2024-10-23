require("dotenv").config;
const express = require("express");

const morgan = require("morgan");
const app = express();
//const cors = require('cors')

app.use(express.json());
console.log("check01");
// Morgan 'tiny' logger for all requests

// Morgan combined format only for error responses (status codes 400 and above)
const customMorgan = (tokens, req, res) => {
  const { name, number } = req.body;
  return [
    `Server running on port ${PORT}`,
    [
      `${tokens.method(req, res)}`,
      `${tokens.url(req, res)}`,
      `${tokens.status(req, res)}`,
      `${tokens.res(req, res, "content-length")}`,
      `${tokens["response-time"](req, res)} ms`,
      `{"name":"${name}", "number":"${number}"}`,
    ].join(" "), // Join the rest with a comma
  ].join("\n"); // Join the port line and the details line with a newline
};

let notes = [
    {
        id: 1,
        content: 'HTML is easy',
        important: true
      },
      {
        id: 2,
        content: 'Browser can execute only JavaScript',
        important: false
      },
      {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        important: true
      }
];
//========== Middleware =========

//app.use(cors())
//=========== Routes =========
//============ get ==============
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

const arrlength = () => {
  return notes.length;
};
// ============= get info ==============
app.get("/api/info", (req, res) => {
  res.send(`notes has note for ${arrlength()} people <br/><br/>
    ${new Date()}.`);
});
// ============= get with id ============
app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: "No Such thing!!!" });
  }
});
// ============= delete with id ============
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

// ============= generate Id function ============
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((p) => p.id)) : 0;
  return maxId + 1;
};
//app.use(morgan(customMorgan));
// ============= post ============

app.post("/api/notes", (req, res) => {
  const { content, important } = req.body;

  if (!content || !important) {
    return res.status(400).json({ error: "note and  important are required!" });
  }
  if (notes.find((note) => note.content === content)) {
    return res.status(400).json({ error: "content must be unique!" });
  }

  const newNote = {
    id: generateId(),
    content,
    important,
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});
//========================================

// ============= PORT & listen ============
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});