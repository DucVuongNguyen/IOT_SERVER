const dotenv = require("dotenv");
dotenv.config();
const axios = require('axios').default;

let sendData = async (NameDevice, Key, Humidity, Temperature) => {
    let data;
    try {
        await axios.post(`${process.env.SERVER_URL}/api/TemperatureHumiditySensor/sendData`, {
            Key: `${Key}`,
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

let getTimeline = async (NameDevice, Key, Date, Month, Year) => {
    let data;
    try {
        await axios.post(`${process.env.SERVER_URL}/api/TemperatureHumiditySensor/getTimeline`, {
            NameDevice: `${NameDevice}`,
            Key: `${Key}`,
            Date: `${Date}`,
            Month: `${Month}`,
            Year: `${Year}`,
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
    sendData,getTimeline
}