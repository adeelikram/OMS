const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    orderId: { type: mongoose.Types.ObjectId, ref: 'Order' },
    projectManager: String,
    assistantOfficer: {
        name: String,
        phone: String,
        email: String,
    },
});

const Model = mongoose.model('OngoingProject', schema);

module.exports = Model;
