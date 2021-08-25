const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');

const {
  syncCustomers,
  getHubspotCustomers,
  getSyncedCustomers
} = require("../controllers/customerController");

router.get('/admin/hubspot',secured, getHubspotCustomers);
router.post('/admin/sync',secured, syncCustomers);

router.get('/customers',secured, getSyncedCustomers);

module.exports = router;