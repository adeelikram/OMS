var { gpData } = require("../fortnox")
const { supplierYesNo } = require("../models/supplierYesNo")
exports.displayFortomsSuppliers = async (req, res) => {
    var data = await gpData("https://api.fortnox.se/3/suppliers", null, req, "GET")
    var db = await supplierYesNo.find({})
    var supp = data?.Suppliers
    if (supp) for (let i = 0; i < supp.length; i++) {
        if (supp[i].SupplierNumber == db[i].supplierNumber && db[i].choice == "yes") {
            data.Suppliers[i].choice = "yes"
        }
        else data.Suppliers[i].choice = "no"
    }

    if (data?.ErrorInformation) {
        data.Suppliers = []
    }
    res.render("displayFortomsSuppliers", {
        headline: null,
        name: req.user.nickname,
        data: data.Suppliers
    })
}