# The Weather Journal

Project for Udacity nanodegree. Technologies: Node (Express), Javascript (FE), Html and CSS.

## Requirements Rubric

Small recap of the project requirements.

### Project Environment Setup
##### Node and Express Environment

- [x] Node and Express should be installed on the local machine. The project file `server.js` should require `express()`, and should create an instance of their app using express.

- [x] The Express app instance should be pointed to the project folder with .html, .css, and .js files.

##### Project Dependencies

- [x] The ‘cors’ package should be installed in the project from the command line, required in the project file `server.js`, and the instance of the app should be setup to use `cors()`.
- [x] The `body-parser` package should be installed and included in the project.

##### Local Server

- [x] Local server should be running and producing feedback to the Command Line through a working callback function.

##### API Credentials

- [x] Create API credentials on [OpenWeatherMap.com](https://openweathermap.org/).

### APIs and Routes
##### APP API Endpoint

- [x] There should be a JavaScript Object named `projectData` initiated in the file `server.js` to act as the app API endpoint.

##### Integrating OpenWeatherMap API

- [x] The personal API Key for OpenWeatherMap API is saved in a named `const` variable.
- [x] The API Key variable is passed as a parameter to `fetch()`.
- [x] Data is successfully returned from the external API.

##### Return Endpoint Data - GET Route I: Server Side

- [x] There should be a GET route setup on the server side with the first argument as a string naming the route, and the second argument a callback function to return the JS object created at the top of server code.

##### Return Endpoint Data - GET Route II: Client Side

- [x] There should be an asynchronous function to fetch the data from the app endpoint.

##### POST Route

- [x] You should be able to add an entry to the project endpoint using a POST route setup on the server side and executed on the client side as an asynchronous function.
- [x] The client side function should take two arguments, the URL to make a POST to, and an object holding the data to POST.
- [x] The server side function should create a new entry in the apps endpoint (the named JS object) consisting of the data received from the client side POST.

### Dynamic UI
##### Naming HTML Inputs and Buttons For Interaction

- [x] The `input` element with the `placeholder` property set to “enter zip code here” should have an `id` of `zip`.
- [x] The `textarea` included in project HTML should have an `id` of `feelings`.
- [x] The button included in project HTML should have an `id` of `generate`.

##### Assigning Element Properties Dynamically

The div with the `id`, `entryHolder` should have three child divs with the ids:

- [x] `date`
- [x] `temp`
- [x] `content`

##### Event Listeners

- [x] Adds an event listener to an existing HTML button from DOM using Vanilla JS.
- [x] In the file `app.js`, the element with the `id` of `generate` should have an `addEventListener()` method called on it, with `click` as the first parameter, and a named callback function as the second parameter.

##### Dynamically Update UI

- [x] Sets the properties of existing HTML elements from the DOM using Vanilla JavaScript.
- [x] Included in the async function to retrieve that app’s data on the client side, existing DOM elements should have their `innerHTML` properties dynamically set according to data returned by the app route.

## Project Commands

First install dependencies for node server:
```console
foo@bar:~$ npm install
```

To start the server normally:

```console
foo@bar:~$ npm run start:node
```

To start the server with hot reload:

```console
foo@bar:~$ npm run start:nodemon
```

Project will run on port `3000`.

## Project Features

The project have the following data that updates every time there's a search entry to the mock backend:

- date (id: `date`);
- weather icon from openweathermap (id: `icon`);
- wather condition (id: `condition`);
- Location Name (id: `city`);
- Location Temperature (id: `temp`);
- Location Minimum Temperature (id: `min_temp`);
- Location Maximum Temperature (id: `max_temp`);
- Content (id: `content`);

When you first load the app, the `app.js` will request to allow geolocalization in order to get the data directly from the your location:

```javascript
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {        
    const crd = pos.coords;
    
    getUpdateAndGet(
        initialWeather(crd.longitude, crd.latitude),
        localUrl('/addData'),
        localUrl('/all'),            
        unsplashApiUrl('/photos/random?query=city'),
    );
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
```

This way you will have weather data displayed from your location. By using the function `initialWeather`:

```javascript
const initialWeather = (lng, lat) => {
    return `${weatherApiBase}?lat=${lat}&lon=${lng}&appId=${weatherApiKey}&units=imperial`;
}
```

The additional feature i included here is that, everytime you perform a search on the openweathermap APIs, also the background image change. This is the result of a call to the Unsplash API on the `/photos/random` endpoint with a query of `?query=city`.

```javascript
...

const unsplashApiUrl = (endpoint) => `${unsplashApiBase}${endpoint}&client_id=${unsplashApiKey}`;

...

const updateBackground = async (url = '') => {
    const request = await fetch(url);

    try {
        const allData = await request.json();
        const picUrl = allData.urls.full;
        main_div.setAttribute(
            'style',
            `background-image: url(${picUrl})`
        );
    } catch (error) {
        console.warn(`ERROR: ${error}`);
    }
}

...

const getUpdateAndGet = (weatherApi, localPost, localGet, unsplashApi) => {
    getData(weatherApi)
        .then(data => {
            const content = feelings.value;
            data.content = content;
            postData(localPost, data)
            // here we call unsplash in the functions chain
            updateBackground(unsplashApi);
        })
        .then(() => {
            updateUI(localGet);
        });
};

...

// then we execute the chain
getUpdateAndGet(
    weatherApiUrl(zipCode.value),
    localUrl('/addData'),
    localUrl('/all'),
    // and we provide the unsplash endpoint
    unsplashApiUrl('/photos/random?query=city'),
);

```

The unsplash API is called also during the first page load.

## Project Possible Improvements

- [ ] Secure the api key in the backend;
- [ ] Search on unsplash the name of the city to get a contextual image;
- [ ] Find a way to understand if the city / area is in USA or Liberia cause only these countries officially use the imperial temperature units (Farenheit);
- [ ] Improve the background image transition with javascript and css;