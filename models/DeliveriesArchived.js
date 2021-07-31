const mongoose = require("mongoose");

const DeliveryArchivedSchema = new mongoose.Schema({
    orderId: {
        type: String,
        default: ""
    },
    placeOfDelivery: {
        type: String,
        default: ""
    },
    customer: {
        type: String,
        default: ""
    },
    orderDate: {
        type: Date,
        default: ""
    },
    adress: {
        type: String,
        default: ""
    },
    zip: {
        type: String,
        default: ""
    },
    deliveryDate: {
        type: String,

    },
    placeOfDelivery: {
        type: String,
        default: ""
    },
    deliveryContact: {
        type: String,
        default: ""
    },
    deliveryContactPhone: {
        type: String,
        default: ""
    },
    deliveryContactEmail: {
        type: String,
        default: ""
    },
    deliveryCreation: {
        type: Date
    },
    deliveryContactATP: {
        type: String,
        default: ""
    },
    deliveryContactATPhone: {
        type: String,
        default: ""
    },
    deliveryContactATEmail: {
        type: String,
        default: ""
    },
    deliveryDateDeadline: {
        type: Date,
    },
    sent: {
        type: String,
        default: "No",
    },
    //...
    roomMateRent: {
        type: Array,
        default: []
    },
    roomMateSold: {
        type: Array,
        default: []
    },
    //Roomaterent Accessories
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
    //Roomate sold Accessories
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
    //
    nucleus: {
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
    sitandShowerRent: {
        type: Array,
        default: []
    },
    sitandShowerSold: {
        type: Array,
        default: []
    },
    //sitshower rent acc
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
    //sitshower sold acc
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
    neatSeat: {
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
    //...
    utprovning: {
        type: Array,
        default: []
    },
    installer: {
        type: String,
        default: ""


    },
    otherInstaller: {
        type: Array,
        default: []

    },
    electrician: {
        type: Array,
        default: []

    },
    // otherElectrician: {
    //     type: Array

    // },
    educationRoomMate: {
        type: Array,
        default: []
    },
    educationNucleus: {
        type: Array,
        default: []
    },
    educationSitandShower: {
        type: Array,
        default: []
    },
    educationNeatseat: {
        type: Array,
        default: []
    }

});
const DeliveryArchived = mongoose.model("DeliveryArchived", DeliveryArchivedSchema);
module.exports = DeliveryArchived;
