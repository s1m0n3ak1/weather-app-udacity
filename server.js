// Framework
const express = require('express');
// Dependencies
const bodyParser = require('body-parser');
const cors = require('cors');

// init express
const app = express();

// Middlewares
// configuration of express in order to use body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// we should use cors (Cross Origin Resource Sharing)
// to avoid any security alert that the browser can lift
app.use(cors());

// initializing the main project folder
app.use(express.static('public'));

// declaring port where our project should run
const port = 3030;

// run the server
app.listen(port, () => {
    console.log(`running on port: ${port}`);
});