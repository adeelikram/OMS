// require mongoose
var mongoose = require('mongoose');
// create Admin schema
const { ObjectID } = require("mongodb")
var sendOrderSchema = new mongoose.Schema({}, { strict: false });
var sendOrder = mongoose.model('send_order_fortnox', sendOrderSchema);
module.exports = { sendOrder: sendOrder };
