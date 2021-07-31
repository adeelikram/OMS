const mongoose = require('mongoose');

const RoomMate = require('./Order/RoomMate');
const Nucleus = require('./Order/Nucleus');
const Neatseat = require('./Order/Neatseat');
const SitShower = require('./Order/SitShower');
const Otium = require('./Order/Otium');

const OrderSchema = new mongoose.Schema({
    customer: { type: String, required: [true, 'Customer is required'] },
    clientName: String,
    contact: String,
    email: String,
    invoiceInfo: String,
    invoiceNumber: {
        type: String,
        required: [true, 'Invoice Number is required'],
    },
    isInvoiceGenerated: {
        type: String,
        required: [true, 'Is Invoice Generated is required'],
    },
    number: { type: String, required: [true, 'Order Number is required'] },
    orderDate: Date,
    orderDeadline: Date,
    accomplished: { type: Boolean, default: false },
    manager: String,
    assistant: {
        name: String,
        contact: String,
        email: String,
    },
    planningMeeting: { type: Boolean, default: false },
    internalConsultation: { type: Boolean, default: false },
    orderedUnits: { type: Boolean, default: false },
    meshSystem: { type: Boolean, default: false },
    internetConnection: { type: String, default: 'no' },
    roomMateRent: RoomMate,
    roomMateSold: RoomMate,
    nucleus: Nucleus,
    neatseat: Neatseat,
    sitShowerRent: SitShower,
    sitShowerSold: SitShower,
    otium: Otium,
});
const Order = mongoose.model('Order', OrderSchema);
const ArchivedOrder = mongoose.model('ArchivedOrder', OrderSchema);

module.exports = {
    Order,
    ArchivedOrder,
};
