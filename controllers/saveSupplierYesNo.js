const { supplierYesNo } = require("../models/supplierYesNo")

exports.saveSupplierYesNo = async function (req, res) {
    var data = req.body.arr
    await supplierYesNo.deleteMany({})
    await supplierYesNo.insertMany(data)
    res.end()
}