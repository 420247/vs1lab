// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const inMemoryGeoTagStore = require('../models/geotag-store');
const inMemoryStore = new inMemoryGeoTagStore();

inMemoryStore.loadExamples();

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
/*router.get('/', (req, res) => {

  const { latitude, longitude } = req.query;

  res.render('index', { taglist: inMemoryStore.getAllGeoTags(), latitude: latitude, longitude: longitude })
});*/

router.get('/', (req, res) => {

  const { latitude, longitude, page = 1, limit = 5 } = req.query;
  const allTags = inMemoryStore.getAllGeoTags();
  const totalTags = allTags.length;
  const paginatedTags = allTags.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(allTags.length / limit);
  currentPage = parseInt(page);

  res.render('index', {
    taglist: allTags,
    latitude: latitude, longitude: longitude,
    totalPages: totalPages,
    currentPage: currentPage,
    totalTags: totalTags
  })
  
});

router.get('/page/', (req, res) => {
  const { latitude, longitude, page = 1, limit = 5} = req.query;
  const allTags = inMemoryStore.getAllGeoTags();
  totalTags = allTags.length;
  const paginatedTags = allTags.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(allTags.length / limit);
  const currentPage = parseInt(page);

  res.json({
    taglist: paginatedTags,
    latitude: latitude,
    longitude: longitude,
    totalPages: totalPages,
    currentPage: currentPage,
    totalTags: totalTags
  });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post('/tagging', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;

  const newTag = new GeoTag(name, latitude, longitude, hashtag);

  inMemoryStore.addGeoTag(newTag);

  const taglist = inMemoryStore.getAllGeoTags();

  res.redirect('/');
  res.render('index', { taglist: taglist, latitude: latitude, longitude: longitude });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post('/discovery', (req, res) => {
  const { latitudeDiscovery, longitudeDiscovery, searchterm } = req.body;

  const GeoTags = inMemoryStore.searchNearbyGeoTags(latitudeDiscovery, longitudeDiscovery, 100000, searchterm);

  res.render('index', { taglist: GeoTags, latitude: latitudeDiscovery, longitude: longitudeDiscovery });
});


// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags', (req, res) => {
  const { latitude, longitude, searchterm } = req.query;

    let filteredTags = inMemoryStore.getNearbyGeoTags(latitude, longitude, 100000);
    if (searchterm && searchterm.trim() !== "") {
        filteredTags = inMemoryStore.searchNearbyGeoTags(latitude, longitude, 100000, searchterm);
    }
    res.json(filteredTags);
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;

  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag);
  inMemoryStore.addGeoTag(newGeoTag);

  res.setHeader('Location', `/api/geotags/${newGeoTag.id}`);
  res.status(201).json(newGeoTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 * 
 * Vlt brauchen wir error? des wär glaub so (ungetestet)
 * if (!tag) {
    return res.status(404).json({ error: "No GeoTag with that ID found" });
  }
 * 
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', (req, res) => {
  const id = req.params.id;
  const tag = inMemoryStore.getById(id);

  res.json(tag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
  const id = req.params.id;
  const { locationName, latitude, longitude, hashtag } = req.query;

  var tag = inMemoryStore.getById(id);

  if (tag) {
    tag.setLocationName(locationName);
    tag.setLatitude(latitude);
    tag.setLongitude(longitude);
    tag.setHashtag(hashtag);
  }
  res.json(inMemoryStore.getById(id));
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req, res) => {
  const id = req.params.id;
  var Tag = inMemoryStore.getById(id);

  if (Tag) {
    inMemoryStore.removeGeoTag(Tag.locationName);
  }

  res.json(Tag);
});

module.exports = router;
