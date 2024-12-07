// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

     /**
     * Constructor to create a GeoTag object.
     * @param {string} name - The name of the GeoTag.
     * @param {number} latitude - The latitude of the GeoTag.
     * @param {number} longitude - The longitude of the GeoTag.
     * @param {string} hashtag - The hashtag associated with the GeoTag.
     */
     constructor(name, latitude, longitude, hashtag) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashtag = hashtag;
    }
    getLatitude() {
        return this.latitude;
    }

    setLatitude(latitude) {
        this.latitude = latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    setLongitude(longitude) {
        this.longitude = longitude;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getHashtag() {
        return this.hashtag;
    }

    setHashtag(hashtag) {
        this.hashtag = hashtag;
    }
    
}

module.exports = GeoTag;
