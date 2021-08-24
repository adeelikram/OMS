const express = require('express');
const { getWorkOrders } = require('../controllers/WorkOrdersController');

const router = express.Router();
const { secured } = require('../middlewares/secured');

router.get('/work-orders', secured, getWorkOrders);
// router.get('/get-ongoing-project/:orderId', secured, editOngoingProject);

module.exports = router;
