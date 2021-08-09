const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    customer: String,
    delivery: {
        type: mongoose.Types.ObjectId,
        ref: 'Delivery',
    },
    roomMate: {
        enabled: Boolean,
        units: Number,
        serialNumber: String,
        wifiNetwork: String,
        password: String,
        online: Boolean,
        connectionProblems: Boolean,
        patient: String,
        roomNumber: String,
    },
    nucleus: {
        enabled: Boolean,
        units: Number,
        unit: String,
        wifiOr4G: String,
        wifiNetwork: String,
        password: String,
        simCard: String,
    },
    neatseat: {
        large: Boolean,
        medium: Boolean,
    },
    sitShower: {
        enabled: Boolean,
        units: Number,
        serialNumber: String,
    },
    otium: {
        enabled: Boolean,
        units: Number,
        serialNumber: String,
        wifiNetwork: String,
        password: String,
    },
});

const ActiveUnit = mongoose.model('ActiveUnit', schema);

module.exports = ActiveUnit;
