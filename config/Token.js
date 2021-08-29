// require admin mongo model
var { admin } = require('../models/admin');
var { getCredentials } = require("../controllers/adminFortnoxController")
// require axios
var axios = require('axios').default;

// axios post request
exports.RefreshToken = async function (token,id) {
    console.log("token at 8 Token.js "+token)
    var url = "https://apps.fortnox.se/oauth-v1/token"
    var body = "grant_type=refresh_token&refresh_token=" + token
    var headers = {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + getCredentials(),
        "Accept": "application/json"
    }
    try {
        var resp = await axios.post(url, body, { headers: headers })
        var { access_token } = resp.data
        await admin.updateOne({ _id: id }, { $set: { access_token: access_token } })
        console.log("Refresh token success")
        return access_token
    } catch (error) {
        console.log("Refresh token failed id: "+id)
        console.log(error.response.data)
        return ""
    }
}

exports.getToken = async function (id) {
    var data = await admin.findOne({ _id: id }) 
    if (!data) {
        return null
    }
    else {
        return data.access_token
    }
}