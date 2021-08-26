const { Order } = require("../models/Order");
var _ = require('lodash');
const { sendOrder } = require("../models/sendOrder");
const { gpData } = require("../fortnox");
exports.sendOrderPage = async function (req, res) {
    const orders = await Order.find({});
    const ordersCount = orders.length;
    res.render('sendOrder', {
        disabled: false,
        editing: false,
        name: req.user.nickname,
        ordersCount
    });
}
exports.postSendOrder = async function (req, res) {
    // var post_data = _.pick(req.body, [
    //     "customer",
    //     "clientName",
    //     "contact",
    //     "email",
    //     "orderDate",
    //     "orderDeadline",
    //     "invoiceInfo",
    //     "invoiceNumber",
    //     "isInvoiceGenerated",
    //     "artNumber"
    // ]);
    // var art = post_data.artNumber;
    // for (var i in req.body) {
    //     var small = i.toLowerCase()
    //     if (small.includes(art.toLowerCase())) {
    //         post_data.units = Number(req.body[i].units)
    //     }
    // }
    // if (req.body.save) {
    //     post_data.sent = false
    //     var count = await sendOrder.countDocuments({});
    //     post_data.count = count + 1;
    //     var resp_mon = await sendOrder.create(post_data);
    //     console.log("successfully saved in database")
    //     console.log(resp_mon)
    // }
    // else {
    //     await prepareCustomer(post_data, req);
    //     await prepareOrder(post_data, req);
    // }
    console.log(req.body)
    
    res.end()
}

async function prepareCustomer(data, req) {
    var obj = {
        "Customer": {
            "CustomerNumber": data.customer,
            "Name": data.clientName,
            "Phone1": data.contact,
            "Email": data.email
        }
    }
    var response = await gpData("https://api.fortnox.se/3/customers/", obj, req, "POST")
    console.log(response)
}

async function prepareOrder(data, req) {
    var obj = {
        "Order": {
            "CustomerNumber": data.customer,
            "CustomerName": data.clientName,
            "Phone1": data.contact,
            "EmailInformation": {
                "EmailAddressTo": data.email
            },
            "OrderDate": data.orderDate,
            "OrderRows": [
                {
                    "ArticleNumber": data.artNumber,
                    "DeliveredQuantity": data.units
                }
            ],
            "ExternalInvoiceReference1": data.invoiceInfo,
            "ExternalInvoiceReference2": data.invoiceNumber,
        }
    }

    var response = await gpData("https://api.fortnox.se/3/orders/", obj, req, "POST")
    console.log(response)
}