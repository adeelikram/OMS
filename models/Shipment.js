const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ShipmentSchema = new mongoose.Schema({
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
    neatSeatL: {
        type: Array,
        default: []
    },
    //Neatseat Acc
    neatseatLWifiAntenna: {
        type: Array,
        default: []
    },
    neatseatLWifi: {
        type: Array,
        default: []
    },
    neatseatLRouterSim: {
        type: Array,
        default: []
    },
    neatseatLNucleusStand: {
        type: Array,
        default: []
    },
    neatseatLForhojningL42: {
        type: Array,
        default: []
    },
    neatseatLForhojningM42: {
        type: Array,
        default: []
    },
    neatseatLForhojningL70: {
        type: Array,
        default: []
    },
    neatseatLForhojningM70: {
        type: Array,
        default: []
    },
    neatseatLArmRest: {
        type: Array,
        default: []
    },
    neatseatLRemote: {
        type: Array,
        default: []
    },
    neatseatLShowerChair: {
        type: Array,
        default: []
    },
    neatSeatM: {
        type: Array,
        default: []
    },
    //Neatseat m Acc
    neatseatMWifiAntenna: {
        type: Array,
        default: []
    },
    neatseatMWifi: {
        type: Array,
        default: []
    },
    neatseatMRouterSim: {
        type: Array,
        default: []
    },
    neatseatMNucleusStand: {
        type: Array,
        default: []
    },
    neatseatMForhojningL42: {
        type: Array,
        default: []
    },
    neatseatMForhojningM42: {
        type: Array,
        default: []
    },
    neatseatMForhojningL70: {
        type: Array,
        default: []
    },
    neatseatMForhojningM70: {
        type: Array,
        default: []
    },
    neatseatMArmRest: {
        type: Array,
        default: []
    },
    neatseatMRemote: {
        type: Array,
        default: []
    },
    neatseatMShowerChair: {
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
const Shipment = mongoose.model("Shipment", ShipmentSchema);
module.exports = Shipment;
