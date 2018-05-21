var http = require("http");
var express = require("express");
var RED = require("node-red");
const https = require('https')
const fs = require('fs')
// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
app.use("/", express.static("public"));

// Create a server
var server = https.createServer(
  {
    key: fs.readFileSync("./cert/localhost.key"),
    cert: fs.readFileSync("./cert/localhost.crt")
  },
  app
);

// Create the settings object - see default settings.js file for other options
var settings = {
  httpAdminRoot: "/red",
  httpNodeRoot: "/api",
  //userDir:"/home/pi/basilisk/.node-red",
  userDir: ".node-red",
  functionGlobalContext: {}, // enables global context
  flowFile: "flows.json"
};

// Initialise the runtime with a server and settings
RED.init(server, settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);

app.use(express.static("build"));

server.listen(8000);

// Start the runtime
RED.start();
