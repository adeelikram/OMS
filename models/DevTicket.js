const mongoose = require("mongoose");

const DevTicketSchema = new mongoose.Schema({
    Subject: {
        type: String,
        required: true
    },
    Description: {
        type: String
    },
    Temporary_action: {
        type: String
    },
    Routine: {
        type: String
    },
    User: {
        type: String,
        required: true
    },
    Type: {
        type: String
    },
    Status: {
        type: String
    },

    Priority_color: {
        type: String
    },

    Priority: {
        type: String,
    },
    Create_deviation : { type : Boolean },
    Open : { type : Boolean },

    Customer_info : {
        name : {type : String},
        organization : { type : String },
        telephone : {type : String},
        mail : {type : String},
        contact_method : {type : String}
    },
    Notes: [
        {
        data : {type : String}
        ,timestamp : {type : Date}
        ,tagged : {type : String}
        ,author : {type : String}
    }
    ],
    timestamp: {
        type: Date,
        default: Date.now
    },
    hubspotlink : {type : String}
},{ timestamps: true });
const Ticket = mongoose.model("DevTicket", DevTicketSchema);
module.exports = Ticket;
