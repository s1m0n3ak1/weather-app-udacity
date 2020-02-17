// Weather API Credentials
// These credentials will be revoked as soon as the project is approved
const weatherApiKey = '3d16e192256d0a8bfe7df56e959e5ed1';
const weatherApiBase = 'https://api.openweathermap.org/data/2.5/weather';

// Unsplash Api Credentials
// These credentials will be revoked as soon as the project is approved
const unsplashApiKey = 'ef52ff3596da2f9610c120bf245124290bc6546378af574e7fdfe6ce9bdd61e4';
const unsplashApiBase = `https://api.unsplash.com`;

// Weather API URL
const weatherApiUrl = (zip) => `${weatherApiBase}?zip=${zip},us&appId=${weatherApiKey}&units=imperial`;
const initialWeather = (lng, lat) => `${weatherApiBase}?lat=${lat}&lon=${lng}&appId=${weatherApiKey}&units=imperial`;
// Unsplash API URL
const unsplashApiUrl = (endpoint) => `${unsplashApiBase}${endpoint}&client_id=${unsplashApiKey}`;
// Local API URL
const localUrl = (endpoint) => `http://localhost:3000${endpoint}`;

// DOM Nodes - Inputs
const zipCode = document.getElementById('zip');
const feelings = document.getElementById('feelings');
const goButton = document.getElementById('generate');

// DOM Nodes - Outputs
const date_div = document.getElementById('date');
const temp_avg_div = document.getElementById('average');
const temp_min_div = document.getElementById('min');
const temp_max_div = document.getElementById('max');
const content_div = document.getElementById('content');
const condition_div = document.getElementById('condition');
const city_div = document.getElementById('city');
const icon_div = document.getElementById('icon');

// DOM Nodes - Root Container
const main_div = document.getElementById('root__container');

const newObject = {};

// here we build the object 'newObject' directly on the frontend
// to avoid unnecessary computational work on the backend
const getData = async (url = '') => {
    const request = await fetch(url);
    
    try {
        const allData = await request.json();
        
        newObject.date = allData.dt;
        newObject.icon = allData.weather[0].icon;
        newObject.condition = allData.weather[0].description;
        newObject.temp_avg = Math.round(allData.main.temp);
        newObject.temp_min = Math.round(allData.main.temp_min);
        newObject.temp_max = Math.round(allData.main.temp_max);
        newObject.city = allData.name;
        return newObject;
    } catch(error) {
        console.warn(`ERROR: ${error}`);
    }
}

// here we post data from the frontend in order
// to update the backend
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });  

    try {
        const newData = await response.json();
        return newData;
    } catch(error) {
        console.warn(`ERROR: ${error}`);
    }
}

// here we post all the necessary data to update
// the div on the frontend, but basically we call
// the updated backend to retrieve new data to display
const updateUI = async (url = '') => {
    const request = await fetch(url);
    
    try {
        const allData = await request.json();
        const date = new Date(allData.date * 1000).toDateString();
        const temp_avg = allData.temp_avg;
        const temp_min = allData.temp_min;
        const temp_max = allData.temp_max;
        const city = allData.city;
        const icon = allData.icon;
        const content = allData.content; 
        const condition = allData.condition;       

        date_div.innerHTML = date;
        temp_avg_div.innerHTML = `${temp_avg} &deg; F`;
        temp_min_div.innerHTML = `${temp_min} &deg; F`;
        temp_max_div.innerHTML = `${temp_max} &deg; F`;
        city_div.innerHTML = city;
        icon_div.setAttribute(
            'src',
            `https://openweathermap.org/img/wn/${icon}@2x.png`
        );
        condition_div.innerHTML = condition;
        content_div.innerHTML = content !== '' ? `"${content}"` : '';
    } catch(error) {
        console.warn(`ERROR: ${error}`);
    }
}

// here we setup the fuinction that will call unsplash api in order to 
// get a new background image from unsplash.api and set the new image
// as a background-image for the property style of the #root__container
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

// in this function we first fetch data from weatherAPI
// then we modify the data object and post the received object
// and finally we update the UI with the newest object received
// from the backend
const getUpdateAndGet = (weatherApi, localPost, localGet, unsplashApi) => {
    getData(weatherApi)
        .then(data => {
            // at this loacation of the script we update
            // the data object with the value that we catch
            // from #feelings textarea
            const content = feelings.value;
            data.content = content;
            postData(localPost, data)
            // here we can call unsplash cause is a separate api
            updateBackground(unsplashApi);
        })
        .then(() => {
            // finally, after we have resolved all the other
            // promises we can update the UI
            updateUI(localGet);
        });
};

document.addEventListener('DOMContentLoaded', () => {

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
    
    // here we inspect the web api in order to get info about user
    // location (longiture and latitude), and we are able to call
    // the openweathermap api using just these 2 location values
    navigator.geolocation.getCurrentPosition(success, error, options);
    
    // here we attach a click trigger to perform a new call
    goButton.addEventListener('click', e => {
        e.preventDefault();
        
        // first we check if the zip input is evaluated
        if (zipCode.value !== '') {
            getUpdateAndGet(
                weatherApiUrl(zipCode.value),
                localUrl('/addData'),
                localUrl('/all'),
                unsplashApiUrl('/photos/random?query=city'),
            );
        // if is empty then we display a warning message on the
        // browser console
        } else {
            console.warn('please provide a zip');
        }
    });
});
