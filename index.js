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
    switch (data.function) {
        case 'join_room': {
            console.log(`User Connected: ${socket.id}`);
            socket.join(data.room);
            console.log(`join_room: ${data.room}`);
            break
        }
        default: {
            break
        }
    }

});

socket.on("getTimeline", async (data) => {
    // console.log(`initSwitch NameDevice: ${data.NameDevice}`);
    // console.log(`initSwitch Key: ${data.Key}`);
    console.log(`Date: ${data.Date}`);
    console.log(`Month: ${data.Month}`);
    console.log(`Year: ${data.Year}`);
    response = await axios_Switch.getTimeline(data.NameDevice, data.Key, data.Date, data.Month, data.Year);
    io.sockets.in(data.room).emit('updateDataTimeline', response);
    // console.log(response)
    // console.log(response)
});
socket.on("handleSwitch", async (data) => {
    // console.log(`initStatusSwitch NameDevice: ${data.NameDevice}`);
    console.log(socket.id);
    console.log(data.room);
    io.sockets.in(data.room).emit('updateStatusSwitch', { DataResult: data.Status, isError: 0 });
    let response = await axios_Switch.sendData(data.NameDevice, data.Key, data.Status);
    io.sockets.in(data.room).emit('updateStatusSwitch', { DataResult: data.Status, isError: 0 });
});
socket.on("handleSwitchKeySecurity", async (data) => {
    // console.log(`initStatusSwitch NameDevice: ${data.NameDevice}`);
    // console.log(`initStatusSwitch KeySecurity: ${data.KeySecurity}`);
    // console.log(`initStatusSwitch Status: ${data.Status}`);
    console.log(`handleSwitchKeySecurity`);
    console.log(data.room);
    io.sockets.in(data.room).emit('updateStatusSwitch', { DataResult: data.Status, isError: 0 });
    let response = await axios_Switch.sendData_KeySecurity(data.NameDevice, data.KeySecurity, data.Status);
    io.sockets.in(data.room).emit('updateStatusSwitch', { DataResult: data.Status, isError: 0 });

});
socket.on("initSwitchSyncReq", async (data) => {
    io.sockets.in(data.room).emit('initSwitch');
});

socket.on("initSwitchSync", async (data) => {
    console.log(`initSwitchSync`);
    io.sockets.in(data.room).emit('updateStatusSwitch', { DataResult: data.Status, isError: 0 });
});

socket.on("keepAlive", async (data) => {
    time_ = new Date().getTime();
    // console.log(`time_ .... ${time_}`)
    // console.log(data.room)
    // console.log(socket.id)
    io.sockets.in(data.room).emit('isDeviceConnect', { isDeviceConnect: 1, NotifyConnect: `Cường độ tín hiệu ${data.RSSI}`, time_Alive: Number(time_) });
    // let response = await axios_Switch.keepAlive(data.NameDevice, data.KeySecurity, data.RSSI);

});

socket.on("checkAlive", async (data) => {
    let now = new Date().getTime();
    // console.log(`now ........................${now}`)
    // console.log(data.room)
    // console.log(`data.time_Alive............ ${data.time_Alive}`)
    let Period = (Number(now) - Number(data.time_Alive)) / 1000;
    if (Number(Period) > 5) {
        // console.log(data.room)
        // console.log(`checkAlive.............................. ${Period}`)
        io.sockets.in(data.room).emit('isDeviceConnect', { isDeviceConnect: 0, NotifyConnect: 'Thiết bị mất kết nối!', time_Alive: 0 });
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




