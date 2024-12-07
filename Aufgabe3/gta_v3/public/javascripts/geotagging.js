// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


function updateLocation() {
        
    const mapImage = document.getElementById('mapView');
    const latitudeView = document.getElementById('latitude');
    const longitudeView = document.getElementById('longitude');
    const latitudeDiscovery = document.getElementById('latitudeDiscovery');
    const longitudeDiscovery = document.getElementById('longitudeDiscovery');

    const mapDiv = document.getElementById('map');
    const taglist_json = mapDiv.getAttribute('data-tags');
    const tags = JSON.parse(taglist_json);

    var mapManager = new MapManager();
    
    if (latitudeView.value == "" || longitudeView.value == "" || latitudeDiscovery.value == "" || longitudeDiscovery.value == "") {
        
        LocationHelper.findLocation((location) => {
        
            latitudeView.value = location.latitude;
            longitudeView.value = location.longitude;
            latitudeDiscovery.value = location.latitude;
            longitudeDiscovery.value = location.longitude;

            console.log('location latitude:' +location.latitude);
            console.log('location longitude:' +location.longitude);

            mapImage.parentNode.removeChild(mapView);

            mapManager.initMap(location.latitude, location.longitude);
            mapManager.updateMarkers(location.latitude, location.longitude, tags);
        
        });
    }else{
        mapManager.initMap(latitudeView.value, longitudeView.value);
        mapManager.updateMarkers(latitudeView.value, longitudeView.value, tags);   
    }

    
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});