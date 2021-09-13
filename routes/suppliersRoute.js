var express = require("express")
const { displayFortomsSuppliers } = require("../controllers/displayFortomsSuppliers")
const { saveSupplierYesNo } = require("../controllers/saveSupplierYesNo")
const { displaySupplierInvoices } = require("../controllers/supplierInvoices")

var router = express.Router()
router.get("/display-fortoms-suppliers", displayFortomsSuppliers)
router.post("/save-supplier-yesno", saveSupplierYesNo)
router.get("/display-suppliers-invoices", displaySupplierInvoices)
module.exports = router