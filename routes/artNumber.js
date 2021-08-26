// require express
var express = require("express")
const { gpData } = require("../fortnox")
var router = express.Router()
router.get("/artNumber", async function (req, res) {
    var data = (await gpData('https://api.fortnox.se/3/articles', null, req, "GET"))?.Articles
    res.render("artNumber", {
        name: req.user.nickname,
        articles: (data) ? data : [],
    })
})
module.exports = router
