const mongoose = require("mongoose")
const { admin } = require('../models/admin');
exports.adminController = async function (req, res) {
    const { nickname } = req.user;
    var domain = String(process.env.CALLBACK_URL)
    domain = domain.substr(0, domain.lastIndexOf("/")) + "/admin"
    if (req.query.code) {
        const obj = await getAccessToken(req.user._id, req.query.code)
        req.user.token = obj.access_token
    }
    res.render('admin', {
        name: nickname,
        domain: encodeURIComponent(domain),
        connected: (req.user.token) ? "Connected" : ""
    });
}

async function getAccessToken(id, code) {
    var axios = require("axios").default
    var domain = String(process.env.CALLBACK_URL)
    domain = domain.substr(0, domain.lastIndexOf("/")) + "/admin"
    var body = "grant_type=authorization_code&code=" + code + "&redirect_uri=" + domain
    try {
        var resp = await axios.post('https://apps.fortnox.se/oauth-v1/token', body, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + getCredentials(),
                "Accept": "application/json"
            }
        })
        const { refresh_token, access_token } = resp.data
        // console.log("new access token: " + access_token)
        console.log("new refresh token " + refresh_token)
        var mongo_resp = await admin.findOne({ _id: id })
        if (!mongo_resp) mongo_resp = await admin.create({ _id: id, access_token: access_token, refresh_token: refresh_token })
        else mongo_resp = await admin.updateOne({ _id: id }, { refresh_token: refresh_token, access_token: access_token })
        return { access_token }
    } catch (error) {
        console.log(error)
    }

}

function getCredentials() {
    var clietid = "t9Qa7vFh2Q6c"
    var client_secret = "VmT6egKGbI"
    return Buffer.from(clietid + ":" + client_secret).toString("base64")
}

exports.getCredentials = getCredentials


