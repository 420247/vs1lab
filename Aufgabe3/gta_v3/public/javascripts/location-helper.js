// File origin: VS1LAB A2 

/**
 * A class to help using the HTML5 Geolocation API.
 */
// eslint-disable-next-line no-unused-vars
class LocationHelper {
    static findLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => callback({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }),
                error => console.error("Geolocation error:", error.message)
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }
}

export default LocationHelper;


