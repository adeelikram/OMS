const { gpData } = require("../fortnox")

exports.displayFortomsCustomers = async (req, res) => {
    var data = await gpData("https://api.fortnox.se/3/customers/", null, req, "GET")
    
    if (data?.ErrorInformation) {
        data.Customers=[]
    }

    res.render("displayFortomsCustomers", {
        name: req.user.nickname,
        data: data.Customers
    })
}