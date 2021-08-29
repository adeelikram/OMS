var _ = require('lodash');
const { sendOrder } = require("../models/sendOrder");
const { fortnoxRefer } = require("../models/fortnoxProdRefer")
const { gpData } = require("../fortnox");
exports.sendOrderPage = async function (req, res) {
    res.render('sendOrder', {
        disabled: false,
        editing: false,
        name: req.user.nickname,
    });
}
exports.postSendOrder = async function (req, res) {
    var order = _.pick(req.body, ["CustomerNumber", "CustomerName", "Phone1", "Email", "OrderDate", "DeliveryCity", "DeliveryCountry", "DeliveryDate", "DeliveryAddress1"])
    var artNumber = (await fortnoxRefer.findOne({}))._doc
    order.OrderRows = prepareOrderRows(_.pick(req.body, ["neatseat", "otium", "sitShowerRent", "roomMateRent", "nucleus"]), artNumber)
    if (req.body.save) {
        order.sent = false
        var resp_mon = await sendOrder.create(order);
        console.log("successfully saved in database")
        console.log(resp_mon)
    }
    else {
        await sendFortnox(order, req, null)
    }
    res.end()
}

exports.postSavedOrder = async function (req, res) {
    var { id } = req.params
    var data = await sendOrder.findOne({ _id: id })
    await sendFortnox(data._doc, req, id)
    res.redirect('/display-fortnox-order')
}

exports.deleteFortnoxOrder = async function (req, res) {
    var { id } = req.params
    var data = await sendOrder.deleteOne({ _id: id })
    res.redirect('/display-fortnox-order')
}

async function sendFortnox(body, req, id) {
    var cust = _.pick(body, ["CustomerNumber", "CustomerName", "Phone1", "Email"])
    var temp = cust["CustomerName"]
    delete cust["CustomerName"]
    cust.Name = temp
    await prepareCustomer({ "Customer": cust }, req);
    ["Email", "_id", "__v", "sent"].forEach(e => delete body[e])
    await prepareOrder({ "Order": body }, req, id);
}

async function prepareCustomer(obj, req) {
    var response = await gpData("https://api.fortnox.se/3/customers/", obj, req, "POST")
}

async function prepareOrder(data, req, id) {
    var response = await gpData("https://api.fortnox.se/3/orders/", data, req, "POST")
    if (!id) {
        data = data.Order
        var res = await sendOrder.updateOne(data, { $set: { sent: true } })
    }
    else {
        var res = await sendOrder.updateOne({ _id: id }, { $set: { sent: true } })
    }
    if (res.ok) console.log("also changed in database " + res)
    console.log(res)
}

function prepareOrderRows(local, artNumber) {
    var orderRows = []
    for (var i in local) {
        for (var e in local[i]) {
            if (e == "units") {
                orderRows.push({
                    ArticleNumber: artNumber[i].split(": ")[1],
                    OrderedQuantity: local[i].units,
                })
            }
            else {
                orderRows.push({
                    ArticleNumber: artNumber[e].split(": ")[1],
                    OrderedQuantity: local[i][e],
                })
            }
        }
    }
    return orderRows
}