// require mongoose
var mongoose = require('mongoose');
// declare mongoose schema
var Schema = mongoose.Schema;
// create supplierYesNo schema
var supplierYesNoSchema = new Schema({
    name: String,
    supplierNumber: String,
    choice: String
})
var model = mongoose.model('supplierYesNo', supplierYesNoSchema);
module.exports = { supplierYesNo: model };