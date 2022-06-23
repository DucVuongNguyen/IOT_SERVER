const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
app.use(cors());
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const API_Route = require("./API_routes/api_routes");
const port = process.env.PORT || 8000;
limit_json_data = 50;
app.use(bodyParser.json({ limit: `${limit_json_data}mb` }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));
const axios_Switch = require("./axios/axios_Switch");
const axios_TemperatureHumiditySensor = require("./axios/axios_TemperatureHumiditySensor");


API_Route(app);
app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với Vhome');
})


const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});





io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("Switch", async (data) => {

        switch (data.function) {
            case 'join_room': {
                console.log(`User Connected: ${socket.id} connect soccket Switch`);
                socket.join(data.room);
                console.log(`join_room: ${data.room}`);
                break
            }
            case 'GetInitStatus': {
                console.log(`GetInitStatus`)
                io.sockets.in(data.room).emit('GetInitStatus');
            }
            case 'InitStatusValue': {
                console.log(`InitStatusValue`)
                io.sockets.in(data.room).emit('InitStatusValue', { DataResult: data.Status, isError: 0 });
            }
            case 'DeviceToApp': {
                io.sockets.in(data.room).emit('SyncStatus', { DataResult: data.Status, isError: 0 });

                let response = await axios_Switch.sendData_KeySecurity(data.NameDevice, data.KeySecurity, data.Status);

                break
            }
            case 'AppToDevice': {
                io.sockets.in(data.room).emit('SyncStatus', { DataResult: data.Status, isError: 0 });
                let response = await axios_Switch.sendData(data.NameDevice, data.Key, data.Status);
                break
            }
            case 'keepAlive': {
                time_ = new Date().getTime();
                io.sockets.in(data.room).emit('isDeviceConnect', { isDeviceConnect: 1, NotifyConnect: `Cường độ tín hiệu ${data.RSSI}`, time_Alive: Number(time_) });
                break
            }
            case 'getTimeline': {
                console.log(`Date: ${data.Date}`);
                console.log(`Month: ${data.Month}`);
                console.log(`Year: ${data.Year}`);
                response = await axios_Switch.getTimeline(data.NameDevice, data.Key, data.Date, data.Month, data.Year);
                io.sockets.in(data.room).emit('updateDataTimeline', response);
                break
            }
            default: {
                break
            }
        }

    });

    socket.on("TemperatureHumiditySensor", async (data) => {
        switch (data.function) {
            case 'join_room': {
                console.log(`User Connected: ${socket.id} connect soccket TemperatureHumiditySensor`);
                socket.join(data.room);
                console.log(`join_room: ${data.room}`);
                break
            }
            case 'initStatus': {
                io.sockets.in(data.room).emit('initStatus');
            }
            case 'DeviceToApp': {
                io.sockets.in(data.room).emit('SyncStatus', { Humidity: data.Humidity, Temperature: data.Temperature, isError: 0 });
                if (Number(data.isSave) === 1) {
                    let response = await axios_TemperatureHumiditySensor.sendData_KeySecurity(data.NameDevice, data.KeySecurity, Number(data.Humidity).toFixed(2), Number(data.Temperature).toFixed(2));
                }
                break
            }
            case 'keepAlive': {
                time_ = new Date().getTime();
                io.sockets.in(data.room).emit('isDeviceConnect', { isDeviceConnect: 1, NotifyConnect: `Cường độ tín hiệu ${data.RSSI}`, time_Alive: Number(time_) });
                break
            }
            case 'getTimeline': {
                console.log(`Date: ${data.Date}`);
                console.log(`Month: ${data.Month}`);
                console.log(`Year: ${data.Year}`);
                response = await axios_Switch.getTimeline(data.NameDevice, data.Key, data.Date, data.Month, data.Year);
                io.sockets.in(data.room).emit('updateDataTimeline', response);
                break
            }
            default: {
                break
            }
        }


    });
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        console.log(socket.rooms);
    });
});

server.listen(port, () => {
    console.log(`Server is running at port ${port}.`);
})




