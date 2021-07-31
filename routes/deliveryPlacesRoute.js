const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');
const {
    getAddPlaceOfDelivery,
    postAddPlaceOfDelivery,
    getEditPlaceOfDelivery,
    postEditPlaceOfDelivery,
    deleteDeliveryPlace,
} = require('../controllers/DeliveryPlacesController');

router.get(
    '/get-add-place-of-delivery/:orderId',
    secured,
    getAddPlaceOfDelivery
);

router.post('/post-add-place-of-delivery', secured, postAddPlaceOfDelivery);
router.get(
    '/get-edit-place-of-delivery/:deliveryId',
    secured,
    getEditPlaceOfDelivery
);
router.post('/post-edit-place-of-delivery', secured, postEditPlaceOfDelivery);
router.delete(
    '/delete-delivery-place/:deliveryPlaceId',
    secured,
    deleteDeliveryPlace
);

module.exports = router;
