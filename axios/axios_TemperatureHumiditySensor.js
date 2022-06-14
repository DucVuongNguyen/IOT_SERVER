const dotenv = require("dotenv");
dotenv.config();
const axios = require('axios').default;

let sendData_KeySecurity = async (NameDevice, KeySecurity, Humidity, Temperature) => {
    let data;
    try {
        await axios.post(`${process.env.SERVER_URL}/api/Switch/sendData_KeySecurity`, {
            KeySecurity: `${KeySecurity}`,
            NameDevice: `${NameDevice}`,
            Humidity: `${Humidity}`,
            Temperature: `${Temperature}`,
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
    sendData_KeySecurity
}