/* Dependencies */
const mongoose = require('mongoose');
const Listing = require('../models/listings.server.model.js');
const coordinates = require('./coordinates.server.controller.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message.
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions refer back to this tutorial
  https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/
  or
  https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d


  If you are looking for more understanding of exports and export modules -
  https://www.sitepoint.com/understanding-module-exports-exports-node-js/
  or
  https://adrianmejia.com/getting-started-with-node-js-modules-require-exports-imports-npm-and-beyond/
 */

/* Create a listing */
exports.create = (req, res) => {
  /* Instantiate a Listing */
  const listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if (req.results) {
    listing.coordinates = {
      latitude: req.results.lat,
      longitude: req.results.lng,
    };
  }

  /* Then save the listing */
  listing.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
      console.log(listing);
    }
  });
};

/* Show the current listing */
exports.read = (req, res) => {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing - note the order in which this function is called by the router */
exports.update = (req, res) => {
  const { listing } = req;
  const { name, code, address } = req.body;

  /* Replace the listings's properties with the new properties found in req.body */
  listing.name = name;
  listing.code = code;
  listing.address = address;

  /* save the coordinates (located in req.results if there is an address property) */
  if (req.results) {
    const { lat, lng } = req.results;
    listing.coordinates = {
      latitude: lat,
      longitude: lng,
    };
  }

  /* Save the listing */
  listing.save((err) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else res.json(listing);
  });
};

/* Delete a listing */
exports.delete = (req, res) => {
  const { listing } = req;

  /* Add your code to remove the listins */
  listing.remove((err) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else {
      res.end();
    }
  });
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = (req, res) => {
  /* Add your code */
  Listing.find().sort('code').exec((err, listings) => {
    if (err) {
      console.error(err);
      res.status(400).send(err);
    } else res.json(listings);
  });
};

/*
  Middleware: find a listing by its ID, then pass it to the next request handler.

  HINT: Find the listing using a mongoose query,
        bind it to the request object as the property 'listing',
        then finally call next
 */
exports.listingByID = (req, res, next, id) => {
  Listing.findById(id).exec((err, listing) => {
    if (err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};
