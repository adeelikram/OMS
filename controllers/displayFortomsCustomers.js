const { gpData } = require("../fortnox")

exports.displayFortomsCustomers = async (req, res) => {
    var data = await gpData("https://api.fortnox.se/3/customers/", null, req, "GET")

    if (data?.data?.ErrorInformation) res.render("displayFortomsCustomers", {
        headline: "Access Token Might be expired",
        name: req.user.nickname,
        data: {}
    })

    else res.render("displayFortomsCustomers", {
        headline: null,
        name: req.user.nickname,
        data: data.Customers
    })
}