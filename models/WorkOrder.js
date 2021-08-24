const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    description: String,
    customer: {
        name: String,
        contact: String,
        email: String,
        title: String,
    },
    responsible: {
        name: String,
        contact: String,
        email: String,
        title: String,
    },
    customerAddress: {
        address: String,
        zip: String,
        area: String,
    },
    responsibleAddress: {
        address: String,
        zip: String,
        area: String,
    },
    user: String,
    date: Date,
    deadline: Date,
    status: String,
});

const Model = mongoose.model('WorkOrder', schema);

module.exports = Model;
