// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class GeoTagStore {
    constructor() {
        this._geoTags = [];
    }

    addGeoTag(geoTag) {
        this._geoTags.push(geoTag);
    }

    removeGeoTag(name) {
        this._geoTags = this._geoTags.filter(tag => tag.name !== name);
    }

    getNearbyGeoTags(lat, lon, radius) {
        return this._geoTags.filter(tag => {
            const distance = this._computeDistance(lat, lon, tag.latitude, tag.longitude);
            return distance <= radius;
        });
    }

    searchNearbyGeoTags(lat, lon, radius, keyword) {
        const tags = this.getNearbyGeoTags(lat, lon, radius);
        return tags.filter(tag =>
            tag.name.toLowerCase().includes(keyword.toLowerCase()) ||
            tag.hashtag.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    _computeDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
module.exports = GeoTagStore;



