const path = require("path");
const express = require("express");
const xss = require("xss");
const notesService = require("./notes-service");

const noteRouter = express.Router();
const bodyParser = express.json();

const serializedNote = (note) => ({
  id: note.id,
  name: xss(note.name),
  content: xss(note.content),
  folderId: note.folderId,
  modified: note.modified,
});

// create get and post route for /
noteRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    notesService
      .getAllNotes(db)
      .then((notes) => {
        res.json(notes.map(serializedNote));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    // use object destructing to access the req body and the newNote object
    const { name, content, folderId } = req.body;
    const newNote = { name, content, folderId };

    // validate to ensure that each field of the request body is present/entered
    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    notesService
      .insertNotes(req.app.get("db"), newNote)
      .then((note) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializedNote(note));
      })
      .catch(next);
  });

// create get, delete and patch route for /:noteId
noteRouter
  .route("/:noteId")
  // there has to be a condition to catch error for if the note does not exist
  .all((req, res, next) => {
    notesService
      .getNoteById(req.app.get("db"), req.params.noteId)
      .then((note) => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` },
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializedNote(res.note));
  })
  .delete((req, res, next) => {
    notesService
      .deleteNote(req.app.get("db"), req.params.noteId)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { name, content, folderId } = req.body;
    const noteToUpdate = { name, content, folderId };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name', 'content' or 'folderId'`,
        },
      });
    notesService
      .updateNote(req.app.get("db"), req.params.noteId, noteToUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = noteRouter;
