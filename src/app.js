// IMPORT REQUIRED LIBRARIES AND SECURITY PACKAGES
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { NODE_ENV, PORT } = require("./config");
const folderRouter = require("./folder-router");
const noteRouter = require("./note-router");
const errorHandler = require("./error-handler");
const logger = require("./logger");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "dev";

//STANDARD MIDDLEWARE
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

//ROUTES
// create route for /api/folders using the router
app.use("/api/folders", folderRouter);
app.use("/api/notes", noteRouter);
// create router for /api/notes using the router

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// CATCH ANY THROWN ERRORS AND THEN DEFINE THE ERROR AND KEEP THE APPLICATION RUNNING;
//STILL MIDDLEWARE
app.use(errorHandler);

//PIPELINE ENDS
module.exports = app;
