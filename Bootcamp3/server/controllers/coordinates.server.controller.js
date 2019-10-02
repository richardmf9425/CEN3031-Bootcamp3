const request = require('request');
const config = require('../config/config');

module.exports = (req, res, next) => {
  if (req.body.address) {
    // This code just formats the address so that it doesn't have space and commas using escape characters
    const addressTemp = req.body.address;
    const addressTemp2 = addressTemp.toLowerCase();
    const addressTemp3 = addressTemp2.replace(/\s/g, '%20');
    const addressTemp4 = addressTemp3.replace(/,/g, '%2C');

    // Setup your options q and key are provided. Feel free to add others to make the JSON response less verbose and easier to read
    const options = {
      q: addressTemp4,
      key: config.openCage.key,
    };

    // Setup your request using URL and options - see ? for format
    request(
      {
        url: 'https://api.opencagedata.com/geocode/v1/json',
        qs: options,
      },
      (error, response, body) => {
        // For ideas about response and error processing see https://opencagedata.com/tutorials/geocode-in-nodejs

        // JSON.parse to get contents. Remember to look at the response's JSON format in open cage data

        /* Save the coordinates in req.results ->
          this information will be accessed by listings.server.model.js
          to add the coordinates to the listing request to be saved to the database.

          Assumption: if we get a result we will take the coordinates from the first result returned
        */
        //  req.results = stores you coordinates

        if (error) {
          console.error(error);
          res.status(400).send(error);
        } else {
          const data = JSON.parse(body);
          req.results = data.results[0].geometry;
        }

        next();
      },
    );
  } else {
    next();
  }
};
