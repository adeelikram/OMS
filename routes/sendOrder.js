// require express and router
var express = require('express');
const { sendOrderPage, postSendOrder,postSavedOrder, deleteFortnoxOrder } = require('../controllers/sendOrderController');
var router = express.Router();
router.get("/send-order", sendOrderPage)
router.post("/send-order", postSendOrder);
router.post("/send-fortnox-order/:id", postSavedOrder);
router.post("/delete-fortnox-order/:id", deleteFortnoxOrder);
module.exports = router;