const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderDeletedSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true
    },
    customerOrderNumber: {
        type: Number,
        // required: true,
        default: 1
    },
    clientName: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // dateDelivery: {
    //     type: String,
    //     required: true
    // },
    accomplished: {
        type: String,
        default: 0,

    },
    status: {
        type: String,
        default: "Start order",
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    orderDeadline: {
        type: Date,
        // default: Date.now,
    },
    //Roommate
    roomMateRent: {
        type: Array,
    },
    roomMateSold: {
        type: Array,
    },
    roomMatePeriod: {
        type: Number,
    },
    roomMatePeriodRent: {
        type: Number,
    },
    roomMatePeriodSold: {
        type: Number,
    },
    roomMateInstallation: {
        type: Number,
    },
    roomMateInstallationRent: {
        type: Number,
    },
    roomMateInstallationSold: {
        type: Number,
    },
    //Nucleus
    nucleus: {
        type: Array,
    },
    nucleusGammal: {
        type: Array,
    },
    rentalPeriodNucleus: {
        type: Number,
    },
    //Neatseat
    neatseatL: {
        type: Array,
    },
    nestseatM: {
        type: Array,
    },
    neatseatInstallation: {
        type: Number
    },
    neatseatType: {
        type: String,
    },
    //Sit&Shower
    sitandshowerSold: {
        type: Array,
    },
    sitandshowerRent: {
        type: Array,
    },
    sitandshowerPeriod: {
        type: Number
    },
    sitandshowerPeriodRent: {
        type: Number
    },
    // sitandshowerPeriodSold: {
    //     type: Number
    // },
    sitandshowerInstallation: {
        type: Number,

    },
    sitandshowerInstallationRent: {
        type: Number,

    },
    sitandshowerInstallationSold: {
        type: Number,

    },
    // rentalPeroodSitandshower: {
    //     type: Number,

    // },
    //Accessories
    wifiAntenna: {
        type: Number,


    },
    wifi: {
        type: Number,


    },
    routerSim: {
        type: Number,


    },
    nucleusStand: {
        type: Number,


    },
    forhojningL42: {
        type: Number,


    },
    forhojningM42: {
        type: Number,


    },
    forhojningL70: {
        type: Number,


    },
    forhojningM70: {
        type: Number,


    },
    armRest: {
        type: Number,


    },
    remote: {
        type: Number,


    },
    showerChair: {
        type: Number,


    },
    addedBy: {
        type: Array,
        "default": []

    },
    placeOfDelivery: {
        type: Schema.Types.ObjectId,
        ref: 'Delivery'
    },
    changeManagement: {
        type: Array
    },
    sendInstructions: {
        type: Array
    },
    projectManager: {
        type: String
    },
    eventBooked: {
        type: String
    }
});
const OrderDeleted = mongoose.model("OrderDeleted", OrderDeletedSchema);
module.exports = OrderDeleted;
