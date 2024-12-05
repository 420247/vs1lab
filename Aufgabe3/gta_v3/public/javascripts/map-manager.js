// File origin: VS1LAB A2

/**
 * A class to help using the Leaflet map service.
 */
class MapManager {
    static initializeMap(latitude = 49.01379, longitude = 8.404435, zoom = 13) {
        if (!this.map) {
            this.map = L.map('map').setView([latitude, longitude], zoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(this.map);
        }
    }

    static updateMarkers(taglist) {
        if (!this.map) {
            console.error("Map is not initialized.");
            return;
        }

        taglist.forEach(tag => {
            L.marker([tag.latitude, tag.longitude]).addTo(this.map)
                .bindPopup(`${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`);
        });
    }
}

export default MapManager;

