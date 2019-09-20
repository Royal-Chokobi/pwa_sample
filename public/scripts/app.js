'use strict';

function getForecastFromCache(coords) {
    // CODELAB: Add code to get weather forecast from the caches object.
    if (!('caches' in window)) {
        return null;
    }
    const url = `${window.location.origin}/forecast/${coords}`;
    return caches.match(url)
        .then((response) => {
            if (response) {
                return response.json();
            }
            return null;
        })
        .catch((err) => {
            console.error('Error getting data from cache', err);
            return null;
        });
}

function updateData() {
    Object.keys(weatherApp.selectedLocations).forEach((key) => {
        const location = weatherApp.selectedLocations[key];
        const card = getForecastCard(location);
        // CODELAB: Add code to call getForecastFromCache
        getForecastFromCache(location.geo)
            .then((forecast) => {
                renderForecast(card, forecast);
            });
        // Get the forecast data from the network.
        getForecastFromNetwork(location.geo)
            .then((forecast) => {
                renderForecast(card, forecast);
            });
    });
}

function init() {
    console.log("KCP PWA TEST");
}

init();