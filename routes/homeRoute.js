const express = require('express');

const router = express.Router();

const { getHome } = require('../controllers/HomeController');

const { secured } = require('../middlewares/secured');

router.get('/', secured, getHome);
module.exports = router;
