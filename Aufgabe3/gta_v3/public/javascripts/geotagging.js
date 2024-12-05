import MapManager from './map-manager.js';
import LocationHelper from './location-helper.js';

function updateLocation() {
    const latInput = document.querySelector('input[name="latitude"]');
    const lonInput = document.querySelector('input[name="longitude"]');
    const mapElement = document.querySelector('#map');
    const taglist = JSON.parse(mapElement.getAttribute('data-tags') || '[]');

    // Überprüfe, ob die Koordinaten bereits gesetzt sind
    if (!latInput.value || !lonInput.value) {
        LocationHelper.findLocation(coords => {
            latInput.value = coords.latitude;
            lonInput.value = coords.longitude;

            // Karte mit den aktuellen Tags aktualisieren
            MapManager.updateMarkers(taglist);
        });
    } else {
        // Falls Koordinaten bereits gesetzt sind, Karte direkt aktualisieren
        MapManager.updateMarkers(taglist);
    }
}

document.addEventListener('DOMContentLoaded', updateLocation);
