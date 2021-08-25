const Hubspot = require('hubspot')
const config = require("../config/keys");

const hubspot = new Hubspot({
  apiKey: config.HUBSPOT_API_KEY,
  checkLimit: false // (Optional) Specify whether to check the API limit on each call. Default: true
});

module.exports = hubspot;