
const { sendOrder } = require("../models/sendOrder");
exports.displayFortnoxOrder = async function (req, res) {
    var order = await sendOrder.find({}).sort({ _id: -1 });
    res.render('displayFortnoxOrder', {
        name: req.user.nickname,
        orders: order,
    })
}