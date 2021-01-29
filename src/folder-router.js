const path = require("path");
const express = require("express");
const xss = require("xss");
const foldersService = require("./folder-service");

const folderRouter = express.Router();
const bodyParser = express.json();

const serializedFolder = (folder) => ({
  id: folder.folderid,
  name: xss(folder.foldername),
});

// create get and post routes
folderRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    foldersService
      .getAllFolders(db)
      .then((folders) => {
        res.json(folders.map(serializedFolder));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = { foldername: name };

    if (!newFolder) {
      return res.status(400).json({
        error: { message: `Missing ${key} in request body.` },
      });
    }
    foldersService
      .insertFolders(res.app.get("db"), newFolder)
      .then((folder) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.folderid}`))
          .json(serializedFolder(folder));
      })
      .catch(next);
  });

// create get, delete, and patch routes
folderRouter
  .route("/:folderId")
  .get((req, res, next) => {
    res.json(serializedFolder(res.folder));
  })
  .delete((req, res, next) => {
    foldersService
      .deleteFolder(req.app.get("db"), req.params.folderId)
      .then(() => {
        // .end() is necessary to end the request response cycle as nothing is sent back using .send()
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    // perform folder validation before the patch request
    const { name } = req.body;
    const folderToUpdate = { name };

    const values = Object.values(folderToUpdate).filter(Boolean).length;

    // if the object is empty
    if (values === 0)
      return rest
        .status(400)
        .json({ error: { message: `Request body must have a name.` } });
    foldersService
      .updateFolder(req.app.get("db"), req.params.folderId, folderToUpdate)
      .then(() => {
        // use .end() to end the request response cycle because nothing is being sent back
        res.status(204).end();
      })
      .catch();
  });

module.exports = folderRouter;
