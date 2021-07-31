const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');

const {
    postOrderManagement,
    postShipment,
    getSendPage,
} = require('../controllers/indexController');

router.post('/post-edit-order-management', secured, postOrderManagement);

router.get('/get-send-page/:deliveryId', secured, getSendPage);
router.post('/post-shipment/:deliveryId', secured, postShipment);

module.exports = router;
