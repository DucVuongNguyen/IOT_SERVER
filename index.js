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
    // socket.on("join_room", async (data) => {
    //     socket.join(data.room);
    //     console.log(`join_room: ${data.room}`);
    // if (Number(data.isDevice) === 1) {
    //     console.log(`####`);
    //     console.log(`${data.room}`);
    //     io.sockets.in(data.room).emit('isDeviceConnect', { isDeviceConnect: 1, NotifyConnect: 'Thiết bị đang kết nối', time_Alive: new Date().getTime() });
    // }
    // });
    socket.on("Switch", async (data) => {
        console.log(`User Connected: ${socket.id} connect soccket Switch`);
        switch (data.function) {
            case 'join_room': {
                socket.join(data.room);
                console.log(`join_room: ${data.room}`);
                break
            }
            case 'initStatus': {
                io.sockets.in(data.room).emit('initStatus');
            }
            case 'DeviceToApp': {
                io.sockets.in(data.room).emit('SyncStatus', { DataResult: data.Status, isError: 0 });
                if (Number(data.isSave)) {
                    let response = await axios_Switch.sendData_KeySecurity(data.NameDevice, data.KeySecurity, data.Status);
                }
                io.sockets.in(data.room).emit('SyncStatus', { DataResult: data.Status, isError: 0 });
                break
            }
            case 'AppToDevice': {
                io.sockets.in(data.room).emit('SyncStatus', { DataResult: data.Status, isError: 0 });
                let response = await axios_Switch.sendData(data.NameDevice, data.Key, data.Status);
                io.sockets.in(data.room).emit('SyncStatus', { DataResult: data.Status, isError: 0 });
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




