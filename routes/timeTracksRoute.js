const express = require('express');
const {
    getTimeTracks,
    getCreateTimeTrack,
    postCreateTimeTrack,
} = require('../controllers/TimeTrackController');

const router = express.Router();
const { secured } = require('../middlewares/secured');

router.get('/time-tracker', secured, getTimeTracks);
router.get('/get-create-time-track', secured, getCreateTimeTrack);

router.post('/post-create-time-track', secured, postCreateTimeTrack);
// router.post(
//     '/post-create-tender-information/:id',
//     secured,
//     postCreateTenderDescription
// );

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
