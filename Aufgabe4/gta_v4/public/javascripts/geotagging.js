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

    //dont know why VS wants to do mapManager(), but DO NOT change
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

async function handleTaggingFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const geoTagData = {
        name: formData.get('name'),
        latitude: formData.get('latitude'),
        longitude: formData.get('longitude'),
        hashtag: formData.get('hashtag'),
    };

    const response = await fetch('/api/geotags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(geoTagData)
    });

    const data = await response.json();
    console.log('Success:', data);

    // Updating the tag list and map
    tags.push(data);
    mapDiv.setAttribute('data-tags', JSON.stringify(tags));

    mapManager.updateMarkers(geoTagData.latitude, geoTagData.longitude, tags);

    const taglistElement = document.getElementById('discoveryResults');
    const li = document.createElement('li');
    li.textContent = `${geoTagData.name} (${geoTagData.latitude}, ${geoTagData.longitude}) ${geoTagData.hashtag}`;
    taglistElement.appendChild(li);
}

async function handleDiscoveryFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    var latitude = latitudeDiscovery.value;
    var longitude = longitudeDiscovery.value;
    var searchterm = formData.get('searchterm');

    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        searchterm: searchterm
    })



    await fetch(`/api/geotags?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },

    }).then(response => response.json())
        .then(data => {

            const taglistElement = document.getElementById('discoveryResults');
            taglistElement.innerHTML = ''; // Clear previous results
            for (const tag of data) {
                const li = document.createElement('li');
                li.textContent = `${tag.locationName} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`;
                taglistElement.appendChild(li);
            }

            mapManager.updateMarkers(latitude, longitude, data);
        })
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    const tagForm = document.getElementById('tag-form');
        if (tagForm) {
            tagForm.addEventListener('submit', handleTaggingFormSubmit);
        }

        const filterForm = document.getElementById('discoveryFilterForm');
        if (filterForm) {
            filterForm.addEventListener('submit', handleDiscoveryFormSubmit);
        }
});