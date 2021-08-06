const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    customer: String,
    delivery: {
        type: mongoose.Types.ObjectId,
        ref: 'Delivery',
    },
    roomMate: {
        serialNumber: String,
        wifiNetwork: String,
        password: String,
        online: Boolean,
        connectionProblems: Boolean,
        patient: String,
        roomNumber: String,
    },
    nucleus: {
        unit: String,
        wifiOr4G: String,
        wifiNetwork: String,
        password: String,
        simCard: String,
    },
    sitShower: {
        serialNumber: String,
    },
    otium: {
        serialNumber: String,
        wifiNetwork: String,
        password: String,
    },
});

const ActiveUnit = mongoose.model('ActiveUnit', schema);

module.exports = ActiveUnit;
