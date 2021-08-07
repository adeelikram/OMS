const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');
const {
    getConfigureActiveUnits,
} = require('../controllers/ActiveUnitsController');

router.get(
    '/get-configure-active-units/:product/:deliveryId',
    secured,
    getConfigureActiveUnits
);

module.exports = router;
