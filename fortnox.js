var axios = require('axios').default;
var { admin } = require("./models/admin")
var { RefreshToken } = require("./config/Token")
exports.gpData = async (url, body, req, method) => {
    try {
        var data = null
        if (method == "GET") data = await axios.get(url, { headers: { "Accept": "application/json", "Authorization": "Bearer " + req.user.token } })
        else if (method == "POST") data = await axios.post(url, body, { headers: { "Accept": "application/json", "Authorization": "Bearer " + req.user.token } })
        return data.data
    } catch (error) {
        if (error.response.data) {
            if (error.response.data.message) {
                console.log(error.response.data)
                var data = await admin.findOne({ _id: req.user._id })
                if (!data) {
                    console.log("connect account first")
                    return ""
                }
                let obj = await RefreshToken(data.refresh_token, req.user._id)
                
                req.user.token = obj
                return await this.gpData(url, body, req, method)
            }
            else {
                console.log(error.response.data)
                return error.response.data
            }
        }
        else {
            console.log(error + " error at line 14 " + __filename.split('\\').slice(-1))
        }
    }
}

