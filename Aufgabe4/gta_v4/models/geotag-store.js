// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTagExamples = require("./geotag-examples");
const GeoTag = require("./geotag");

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
class InMemoryGeoTagStore {
    #geoTagsArray;

    constructor() {
        this.#geoTagsArray = [];
        this.iDs = 0;
    }

    getById(id){
        return this.#geoTagsArray.find(tag => tag.id == id);
    }

    addGeoTag(geoTag) {
        geoTag.id = this.iDs++;
        this.#geoTagsArray.push(geoTag);
    }

    removeGeoTag(locationName) {
        this.#geoTagsArray = this.#geoTagsArray.filter(tag => tag.locationName !== locationName);
    }

    getNearbyGeoTags(latitude, longitude, radius = 10.0) {

        let foundGeoTags = [];

        for (let i = 0; i < this.#geoTagsArray.length; i++) {
            const currentTag = this.#geoTagsArray[i];
    
            const distance = this.calcDistance(latitude, longitude, currentTag.getLatitude(), currentTag.getLongitude());
    
            if (distance <= radius) {
                foundGeoTags.push(this.#geoTagsArray[i]);
            }
        }
        
        return foundGeoTags;
    }

    searchNearbyGeoTags(latitude, longitude, radius, searchterm) {

        let nearbyGeoTags = this.getNearbyGeoTags(latitude, longitude, radius);

        let foundGeoTags = [];

        for (let i = 0; i < nearbyGeoTags.length; i++) {
            const name = nearbyGeoTags[i].getLocationName();
            const hashtag = nearbyGeoTags[i].getHashtag();

            if (name !== undefined && name.includes(searchterm) ||
                hashtag !== undefined && hashtag.includes(searchterm)) {
                foundGeoTags.push(nearbyGeoTags[i]);
            }
        }

        return foundGeoTags;
    }

    calcDistance2(lat1, lon1, lat2, lon2) {
        let dLat = (lat2 - lat1) * Math.PI / 180.0;
        let dLon = (lon2 - lon1) * Math.PI / 180.0;
        lat1 = (lat1) * Math.PI / 180.0;
        lat2 = (lat2) * Math.PI / 180.0;
        let a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) *
                Math.cos(lat1) *
                Math.cos(lat2);
        let rad = 6371;
        let c = 2 * Math.asin(Math.sqrt(a));
        return rad * c;
    }

    calcDistance(lat1, lon1, lat2, lon2) {
        let dLat = (lat2 - lat1);
        let dLon = (lon2 - lon1);

        let pyta = Math.pow(dLat, 2) + Math.pow(dLon, 2);
        return Math.sqrt(pyta);
    }

    getAllGeoTags() {
        let allGeoTags = [];
        for (let i = 0; i < this.#geoTagsArray.length; i++) {
            allGeoTags.push(this.#geoTagsArray[i]);
        }
        return allGeoTags;
    }


    loadExamples() {

        const tagList = GeoTagExamples.tagList;
        tagList.forEach(tag => {
            this.addGeoTag(new GeoTag(tag[0], tag[1], tag[2], tag[3]));
        });
    }
}

module.exports = InMemoryGeoTagStore
