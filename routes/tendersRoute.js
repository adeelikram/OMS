const express = require('express');
const {
    getTenders,
    getCreateTender,
    postCreateTender,
    getEditTender,
    postEditTender,
    getTenderRequirements,
} = require('../controllers/TendersController');

const router = express.Router();
const { secured } = require('../middlewares/secured');

router.get('/tenders', secured, getTenders);

router.get('/get-create-tender', secured, getCreateTender);
router.post('/post-create-tender', secured, postCreateTender);

router.get('/get-edit-tender/:id', secured, getEditTender);
router.post('/post-edit-tender/:id', secured, postEditTender);

router.get('/get-tender-requirements/:id', secured, getTenderRequirements);

// router.get(
//     '/get-configure-active-units/:product/:deliveryId',
//     secured,
//     getConfigureActiveUnits
// );

// router.post(
//     '/post-configure-active-units/:product/:deliveryId',
//     secured,
//     postConfigureActiveUnits
// );

// router.get(
//     '/get-active-units-details/:customer',
//     secured,
//     getActiveUnitsByCustomer
// );

module.exports = router;
