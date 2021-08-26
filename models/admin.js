// require mongoose
var mongoose = require('mongoose');
// create Admin schema
const { ObjectID } = require("mongodb")
var AdminSchema = new mongoose.Schema({
    _id: ObjectID,
    access_token: String,
    refresh_token: String,
})
var admin = mongoose.model('api_token', AdminSchema);
module.exports = { admin: admin };
