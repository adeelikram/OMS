const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    company: String,
    contractor: String,
    email: String,
    phone: String,
    customer: String,
    rating: Number,
    comments: String,
    neatseat: Boolean,
});

const Model = mongoose.model('Contractor', schema);

module.exports = Model;
