// express router
var express = require('express');
const { displayFortnoxOrder } = require('../controllers/displayFortnoxOrder');
const router = express.Router();
router.get('/display-fortnox-order',displayFortnoxOrder)
module.exports = router;