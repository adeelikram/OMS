const express = require('express');

const router = express.Router();
const { secured } = require('../middlewares/secured');
const {
    getOrders,
    getEditOrder,
    getAddOrder,
    postAddOrder,
    postEditOrder,
    deleteOrder,
    getOrderStatus,
    postEditOrderStatus,
    archiveOrder,
    getArchivedOrders,
    getViewArchivedOrder,
    restoreOrder,
} = require('../controllers/OrdersController');

router.get('/orders', secured, getOrders);
router.get('/get-edit-order/:orderId', secured, getEditOrder);
router.get('/add-order', secured, getAddOrder);
router.post('/add-order', secured, postAddOrder);
router.post('/post-edit-order', secured, postEditOrder);
router.delete('/delete-order/:orderId', secured, deleteOrder);
router.get('/get-order-status/:orderId', secured, getOrderStatus);
router.post('/post-edit-order-status', secured, postEditOrderStatus);
router.post('/archive-order/:orderId', secured, archiveOrder);
router.get('/archived-orders', secured, getArchivedOrders);
router.get('/archived-order/:orderId', secured, getViewArchivedOrder);
router.post('/restore-order/:orderId', secured, restoreOrder);
module.exports = router;
