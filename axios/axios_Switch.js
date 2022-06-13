const dotenv = require("dotenv");
dotenv.config();
const axios = require('axios').default;
let readData = async (NameDevice, Key) => {
    let data;
    try {
        await axios.post(`${process.env.SERVER_URL}/api/Switch/readData`, {
            Key: `${Key}`,
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

let sendData = async (NameDevice, Key, Status) => {
    let data;
    try {
        await axios.post(`${process.env.SERVER_URL}/api/Switch/sendData`, {
            Key: `${Key}`,
            NameDevice: `${NameDevice}`,
            Status: `${Status}`
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


let sendData_KeySecurity = async (NameDevice, KeySecurity, Status) => {
    let data;
    try {
        await axios.post(`${process.env.SERVER_URL}/api/Switch/sendData_KeySecurity`, {
            KeySecurity: `${KeySecurity}`,
            NameDevice: `${NameDevice}`,
            Status: `${Status}`
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
        await axios.post(`${process.env.SERVER_URL}/api/Switch/getTimeline`, {
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
    readData, sendData,
    sendData_KeySecurity,getTimeline
}