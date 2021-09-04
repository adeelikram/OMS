
const { gpData } = require("../fortnox")
const { OrderRows, EmailInformation, Order, neatseat, nucleus, otium, roomMateRent, sitShowerRent } = require("../config/fortnox.json")
const { fortnoxRefer } = require("../models/fortnoxProdRefer")

var oms = [
    { 'neatseat': [...neatseat] },
    { 'nucleus': [...nucleus] },
    { 'otium': [...otium] },
    { 'roomMateRent': [...roomMateRent] },
    { 'sitShowerRent': [...sitShowerRent] }
]



exports.fortnoxProdController = async function (req, res) {
    var fort = []
    var data = (await gpData('https://api.fortnox.se/3/articles', null, req, "GET")).Articles
    if (!("error" in data)) for (let el of data) {
        if (!fort.includes("ArticleNumber: " + el.ArticleNumber)) fort.push("ArticleNumber: " + el.ArticleNumber)
    }
    data = await fortnoxRefer.findOne({})
    res.render("fortnox-prod-list", {
        oms: oms,
        name: req.user.nickname,
        fort: fort,
        data: (data._doc) ? data._doc : {},
    })
}
exports.fortnoxProdPostController = async function (req, res) {
    await fortnoxRefer.deleteMany({})
    await fortnoxRefer.create(req.body)
    res.end()
}