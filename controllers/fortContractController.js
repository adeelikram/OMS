const { Order } = require("../models/Order")
var _ = require('lodash')
const { fortnoxRefer } = require("../models/fortnoxProdRefer")
const { gpData } = require("../fortnox")
exports.fortnoxContractController = async function (req, res) {
    var data = await Order.find()
    res.render("fortContract", {
        name: req.user?.nickname,
        data: data,
        user: { role: "" }
    })
}
exports.fortnoxPostContractController = async function (req, res) {
    var data = await Order.findOne({ _id: req.body.id })
    var refer = await fortnoxRefer.find()
    var invoiceRows = []
    var { roomMate, nucleus, neatseat, sitShower, otium, customer } = data
    var obj = { roomMate, nucleus, neatseat, sitShower, otium }
    prepareInvoiceRows(obj, invoiceRows, refer[0]._doc)
    if (invoiceRows.length == 0) return res.json({ data: { ErrorInformation: { message: "This order lacks invoice rows. So cant be posted to fortnox" } } })

    delete req.body.id
    var { EmailAddressFrom } = req.body
    delete req.body.EmailAddressFrom

    var date = new Date()
    month = ((date.getMonth() < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))
    currDate = ((date.getDate() < 10) ? "0" + date.getDate() : date.getDate())

    date = `${date.getFullYear() + 1}-${month}-${date.getDate()}`
    console.log(date)
    if (EmailAddressFrom) var postData = {
        Contract: {
            ...req.body,
            EmailInformation: { EmailAddressFrom },
            InvoiceRows: invoiceRows,
            PeriodEnd: date,
        }
    }
    else var postData = {
        Contract: {
            ...req.body,
            InvoiceRows: invoiceRows,
            PeriodEnd: date,
        }
    }
    var response = await gpData("https://api.fortnox.se/3/contracts/", postData, req, "POST")
    console.log(response)
    res.json(response)
    res.end()
}

function prepareInvoiceRows(obj, orderRows, refer) {
    for (var i in obj) {
        if ("units" in obj[i]) {
            if (i == "roomMate" || i == "sitShower") var p = i + "Rent"
            orderRows.push({ ArticleNumber: refer[p].split(": ")[1], DeliveredQuantity: obj[i].units.bought })
        }
        if ("accessories" in obj[i]) {
            for (var v in obj[i].accessories) {
                if (v in refer && typeof refer[v] == "string" && obj[i].accessories[v].bought) orderRows.push({
                    ArticleNumber: refer[v].split(": ")[1],
                    DeliveredQuantity: obj[i].accessories[v].bought
                })
            }
        }
    }
}