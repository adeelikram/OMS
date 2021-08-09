const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');
const {
    getConfigureActiveUnits,
    postConfigureActiveUnits,
} = require('../controllers/ActiveUnitsController');

router.get(
    '/get-configure-active-units/:product/:deliveryId',
    secured,
    getConfigureActiveUnits
);

router.post(
    '/post-configure-active-units/:product/:deliveryId',
    secured,
    postConfigureActiveUnits
);

module.exports = router;
