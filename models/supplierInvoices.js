// require mongoose 
var mongoose = require('mongoose');
// require the mongoose schema
var Schema = mongoose.Schema;
// create a schema
var supplier = new Schema({
    name: String,
    amount: Number,
    pic: String,
    supplierNumber:String,
    date:String
})
// create a model
var supplierInvoices = mongoose.model('supplier_Invoices', supplier);
module.exports = { supplierInvoices: supplierInvoices };
