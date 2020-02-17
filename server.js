// Fake endopint
const projectData = {};
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
app.use(express.static('website'));

// declaring port where our project should run
const port = 3000;

// run the server
app.listen(port, () => {
    console.log(`running on port: ${port}`);
});

// App Routes
app.get('/all', getWeatherData);

function getWeatherData(req, res) {
    console.log(projectData);
    res.send(projectData);
}

app.post('/addData', addWeatherData);

function addWeatherData(req, res) {
    projectData.date = req.body.date;
    projectData.icon = req.body.icon;
    projectData.condition = req.body.condition;
    projectData.temp_avg = req.body.temp_avg;
    projectData.temp_min = req.body.temp_min;
    projectData.temp_max = req.body.temp_max;
    projectData.city = req.body.city;
    projectData.content = req.body.content;
    res.sendStatus(200)
}
