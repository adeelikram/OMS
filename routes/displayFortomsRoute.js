var express  =require("express")
const { displayFortomsCustomers } = require("../controllers/displayFortomsCustomers")
var router = express.Router()
router.get("/display-fortoms-customers",displayFortomsCustomers)
module.exports = router
