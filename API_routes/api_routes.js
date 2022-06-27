const router = require("express").Router();
const api_Switch = require("../API_Controllers/api_Switch");
const api_Check = require("../API_Controllers/api_Check");
const api_Device = require("../API_Controllers/api_Device");
const api_TemperatureHumiditySensor = require("../API_Controllers/api_TemperatureHumiditySensor")

const API_Route = (app) => {
    // switch
    router.post('/Switch/sendData', api_Switch.sendData);
    router.post('/Switch/resetKey', api_Switch.resetKey);
    router.post('/Switch/readData', api_Switch.readData);
    router.post('/Switch/getKey', api_Switch.getKey);
    router.post('/Switch/getTimeline', api_Switch.getTimeline);
    router.post('/Switch/updateKey', api_Switch.updateKey);

    // TemperatureHumiditySensor
    router.post('/TemperatureHumiditySensor/getKey', api_TemperatureHumiditySensor.getKey);
    router.post('/TemperatureHumiditySensor/ressetKey', api_TemperatureHumiditySensor.resetKey);
    router.post('/TemperatureHumiditySensor/sendData', api_TemperatureHumiditySensor.sendData);
    router.post('/TemperatureHumiditySensor/getTimeline', api_TemperatureHumiditySensor.getTimeline);
    router.post('/TemperatureHumiditySensor/updateKey', api_TemperatureHumiditySensor.updateKey);



    // user
    router.post('/checkUser', api_Check.checkUser);
    router.post('/checkDevice', api_Check.checkDevice);
    router.post('/Signup', api_Check.Signup);

    //add
    router.post('/addDevice', api_Device.addDevice);
    router.post('/deleteDevice', api_Device.deleteDevice);
    router.post('/renameDevice', api_Device.renameDevice);

    return app.use('/api', router)

}
module.exports = API_Route;