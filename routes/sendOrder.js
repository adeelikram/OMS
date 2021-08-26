// require express and router
var express = require('express');
const { sendOrderPage, postSendOrder } = require('../controllers/sendOrderController');
var router = express.Router();
router.get("/send-order", sendOrderPage)
router.post("/send-order", postSendOrder);
module.exports = router;