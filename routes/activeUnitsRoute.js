const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');
const {
    getConfigureActiveUnits,
    postConfigureActiveUnits,
    getActiveUnits,
    getActiveUnitsByCustomer,
} = require('../controllers/ActiveUnitsController');

router.get('/active-units', secured, getActiveUnits);

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

router.get(
    '/get-active-units-details/:customer',
    secured,
    getActiveUnitsByCustomer
);

module.exports = router;
