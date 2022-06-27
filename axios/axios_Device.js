const dotenv = require("dotenv");
dotenv.config();
const axios = require('axios').default;
let getKey = async (NameDevice, KeySecurity) => {
    let data;
    try {
        await axios.post(`${process.env.SERVER_URL}/api/getKey`, {
            KeySecurity: `${KeySecurity}`,
            NameDevice: `${NameDevice}`,
        })
            .then(res => {
                // console.log('checkUser');
                // console.log(res.data);
                data = res.data

            })
    } catch (e) {
        console.log(e)
    }
    return data
}
module.exports = {
    getKey
}