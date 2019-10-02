const mongoose = require('mongoose');
const config = require('./config');
const express = require('./express'); // refers to express.js file in our application not Express the Middleware helper for Node.js

module.exports.start = () => {
  const app = express.init();
  app.listen(config.port, () => {
    console.log('App.js file is listening on port', config.port);
  });
};
