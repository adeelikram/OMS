// require mongoose
var mongoose = require('mongoose');
// create Admin schema

let fort = new mongoose.Schema({}, { strict: false })
let temp = mongoose.model('fortnox_refer', fort);
module.exports = { fortnoxRefer: temp };
