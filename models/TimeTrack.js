const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type: { type: String },
    project: {},
    customer: String,
    topic: String,
    hours: String,
    minutes: String,
});

const Model = mongoose.model('TimeTrack', schema);

module.exports = Model;
