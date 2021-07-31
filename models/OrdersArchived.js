const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrdersArchivedSchema = new mongoose.Schema({
    customer: {
        type: String,
        default: ""
        // required: true
    },
    customerOrderNumber: {
        type: Number,
        // required: true,
        default: 1
    },
    clientName: {
        type: String,
        default: ""
        // required: true
    },
    number: {
        type: String,
        default: ""
        // required: true
    },
    email: {
        type: String,
        default: ""
        // required: true
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
        default: "",
    },
    //Roommate rent
    roomMateRent: {
        type: Array,
        default: []
    },
    roomMateSold: {
        type: Array,
        default: []
    },
    roomMatePeriod: {
        type: Number,
        default: 0
    },
    roomMatePeriodRent: {
        type: Number,
        default: 0
    },
    roomMatePeriodSold: {
        type: Number,
        default: 0
    },
    roomMateInstallation: {
        type: Number,
        default: 0
    },
    roomMateInstallationRent: {
        type: Number,
        default: 0
    },
    roomMateInstallationSold: {
        type: Number,
        default: 0
    },
    //Nucleus
    nucleus: {
        type: Array,
        default: []
    },
    nucleusGammal: {
        type: Array,
        default: []
    },
    rentalPeriodNucleus: {
        type: Number,
        default: 0
    },
    //Neatseat
    neatseatL: {
        type: Array,
        default: []
    },
    nestseatM: {
        type: Array,
        default: []
    },
    neatseatInstallation: {
        type: Number,
        default: 0
    },
    neatseatType: {
        type: String,
        default: ""
    },
    //Sit&Shower
    sitandshowerSold: {
        type: Array,
        default: []
    },
    sitandshowerRent: {
        type: Array,
        default: []
    },
    sitandshowerPeriod: {
        type: Number,
        default: 0
    },
    sitandshowerPeriodRent: {
        type: Number,
        default: 0
    },
    // sitandshowerPeriodSold: {
    //     type: Number
    // },
    sitandshowerInstallation: {
        type: Number,
        default: 0

    },
    sitandshowerInstallationRent: {
        type: Number,
        default: 0

    },
    sitandshowerInstallationSold: {
        type: Number,
        default: 0

    },
    // rentalPeroodSitandshower: {
    //     type: Number,

    // },

    //Roomaterent rent Accessories
    roomMateRentWifiAntenna: {
        type: Array,
        default: []
    },
    roomMateRentWifi: {
        type: Array,
        default: []
    },
    roomMateRentRouterSim: {
        type: Array,
        default: []
    },
    roomMateRentNucleusStand: {
        type: Array,
        default: []
    },
    roomMateRentForhojningL42: {
        type: Array,
        default: []
    },
    roomMateRentForhojningM42: {
        type: Array,
        default: []
    },
    roomMateRentForhojningL70: {
        type: Array,
        default: []
    },
    roomMateRentForhojningM70: {
        type: Array,
        default: []
    },
    roomMateRentArmRest: {
        type: Array,
        default: []
    },
    roomMateRentRemote: {
        type: Array,
        default: []
    },
    roomMateRentShowerChair: {
        type: Array,
        default: []
    },
    //roomateSold Acc
    roomMateSoldWifiAntenna: {
        type: Array,
        default: []
    },
    roomMateSoldWifi: {
        type: Array,
        default: []
    },
    roomMateSoldRouterSim: {
        type: Array,
        default: []
    },
    roomMateSoldNucleusStand: {
        type: Array,
        default: []
    },
    roomMateSoldForhojningL42: {
        type: Array,
        default: []
    },
    roomMateSoldForhojningM42: {
        type: Array,
        default: []
    },
    roomMateSoldForhojningL70: {
        type: Array,
        default: []
    },
    roomMateSoldForhojningM70: {
        type: Array,
        default: []
    },
    roomMateSoldArmRest: {
        type: Array,
        default: []
    },
    roomMateSoldRemote: {
        type: Array,
        default: []
    },
    roomMateSoldShowerChair: {
        type: Array,
        default: []
    },
    //Nucleus acc
    nucleusWifiAntenna: {
        type: Array,
        default: []
    },
    nucleusWifi: {
        type: Array,
        default: []
    },
    nucleusRouterSim: {
        type: Array,
        default: []
    },
    nucleusNucleusStand: {
        type: Array,
        default: []
    },
    nucleusForhojningL42: {
        type: Array,
        default: []
    },
    nucleusForhojningM42: {
        type: Array,
        default: []
    },
    nucleusForhojningL70: {
        type: Array,
        default: []
    },
    nucleusForhojningM70: {
        type: Array,
        default: []
    },
    nucleusArmRest: {
        type: Array,
        default: []
    },
    nucleusRemote: {
        type: Array,
        default: []
    },
    nucleusShowerChair: {
        type: Array,
        default: []
    },
    //Neatseat Acc
    neatseatWifiAntenna: {
        type: Array,
        default: []
    },
    neatseatWifi: {
        type: Array,
        default: []
    },
    neatseatRouterSim: {
        type: Array,
        default: []
    },
    neatseatNucleusStand: {
        type: Array,
        default: []
    },
    neatseatForhojningL42: {
        type: Array,
        default: []
    },
    neatseatForhojningM42: {
        type: Array,
        default: []
    },
    neatseatForhojningL70: {
        type: Array,
        default: []
    },
    neatseatForhojningM70: {
        type: Array,
        default: []
    },
    neatseatArmRest: {
        type: Array,
        default: []
    },
    neatseatRemote: {
        type: Array,
        default: []
    },
    neatseatShowerChair: {
        type: Array,
        default: []
    },
    //sitshower rent
    sitShowerRentWifiAntenna: {
        type: Array,
        default: []
    },
    sitShowerRentWifi: {
        type: Array,
        default: []
    },
    sitShowerRentRouterSim: {
        type: Array,
        default: []
    },
    sitShowerRentNucleusStand: {
        type: Array,
        default: []
    },
    sitShowerRentForhojningL42: {
        type: Array,
        default: []
    },
    sitShowerRentForhojningM42: {
        type: Array,
        default: []
    },
    sitShowerRentForhojningL70: {
        type: Array,
        default: []
    },
    sitShowerRentForhojningM70: {
        type: Array,
        default: []
    },
    sitShowerRentArmRest: {
        type: Array,
        default: []
    },
    sitShowerRentRemote: {
        type: Array,
        default: []
    },
    sitShowerRentShowerChair: {
        type: Array,
        default: []
    },
    //sitshower sold
    sitShowerSoldWifiAntenna: {
        type: Array,
        default: []
    },
    sitShowerSoldWifi: {
        type: Array,
        default: []
    },
    sitShowerSoldRouterSim: {
        type: Array,
        default: []
    },
    sitShowerSoldNucleusStand: {
        type: Array,
        default: []
    },
    sitShowerSoldForhojningL42: {
        type: Array,
        default: []
    },
    sitShowerSoldForhojningM42: {
        type: Array,
        default: []
    },
    sitShowerSoldForhojningL70: {
        type: Array,
        default: []
    },
    sitShowerSoldForhojningM70: {
        type: Array,
        default: []
    },
    sitShowerSoldArmRest: {
        type: Array,
        default: []
    },
    sitShowerSoldRemote: {
        type: Array,
        default: []
    },
    sitShowerSoldShowerChair: {
        type: Array,
        default: []
    },
    //...
    addedBy: {
        type: Array,
        default: []
    },
    placeOfDelivery: {
        type: Schema.Types.ObjectId,
        ref: 'Delivery'
    },
    changeManagement: {
        type: Array,
        default: []
    },
    sendInstructions: {
        type: Array,
        default: []
    },
    projectManager: {
        type: String,
        default: ""
    },
    eventBooked: {
        type: String,
        default: ""
    }
});
const OrderArchived = mongoose.model("ArchivedOrder", OrdersArchivedSchema);
module.exports = OrderArchived;
