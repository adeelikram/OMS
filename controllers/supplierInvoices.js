var { supplierInvoices } = require("../models/supplierInvoices")
var { supplierYesNo } = require("../models/supplierYesNo")
var _ = require('lodash');
const { Order } = require("../models/Order");
exports.displaySupplierInvoices = async function (req, res) {
    var data = await supplierYesNo.find({ choice: "yes" })
    data = await supplierInvoices.find({ supplierNumber: { $in: _.map(data, 'supplierNumber') } }).sort({ date: -1 })
    var projects = await Order.find({})
    if (data) data = main(data)
    else data = []
    res.render("supplierInvoices", {
        name: "",// req.user.nickname,
        data: data,
        projects: projects
    })
}

function main(data) {
    var obj = {}
    for (var i of data) {
        for (var e in i) {
            if (e == 'date') {
                var delim = i[e].split("-")
                delim = `${delim[0]}-${delim[1]}-1`
                if (!obj[delim]) {
                    obj[delim] = []
                    obj[delim].push(i)
                }
                else obj[delim].push(i)
            }

        }

    }
    return obj
}