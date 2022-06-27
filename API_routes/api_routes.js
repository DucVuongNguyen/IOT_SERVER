const router = require("express").Router();
const api_Switch = require("../API_Controllers/api_Switch");
const api_Check = require("../API_Controllers/api_Check");
const api_Device = require("../API_Controllers/api_Device");
const api_TemperatureHumiditySensor = require("../API_Controllers/api_TemperatureHumiditySensor")

const API_Route = (app) => {
    // switch
    router.post('/Switch/sendData', api_Switch.sendData);
    router.post('/Switch/readData', api_Switch.readData);
    router.post('/Switch/getTimeline', api_Switch.getTimeline);

    // TemperatureHumiditySensor
    router.post('/TemperatureHumiditySensor/sendData', api_TemperatureHumiditySensor.sendData);
    router.post('/TemperatureHumiditySensor/getTimeline', api_TemperatureHumiditySensor.getTimeline);

    // user
    router.post('/checkUser', api_Check.checkUser);
    router.post('/checkDevice', api_Check.checkDevice);
    router.post('/Signup', api_Check.Signup);

    //devices
    router.post('/addDevice', api_Device.addDevice);
    router.post('/deleteDevice', api_Device.deleteDevice);
    router.post('/renameDevice', api_Device.renameDevice);
    router.post('/getKey', api_Device.getKey);
    router.post('/changeKey', api_Device.changeKey);
    router.post('/resetKey', api_Device.resetKey);
    router.post('/updateKey', api_Device.updateKey);

    return app.use('/api', router)

}
module.exports = API_Route;