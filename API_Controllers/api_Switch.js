const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

let updateKey = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.UserName || !req.body.Password || !req.body.NameDevice || !req.body.NewKey) {
            return res.status(200).json({
                message: `Thông tin không để trống`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let NewKey = req.body.NewKey;
        let UserName = req.body.UserName;
        let Password = req.body.Password;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`NewKey: ${NewKey}`);
        // console.log(`OldKey: ${OldKey}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;

        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: NewKey });
        let Response_ = result;
        if (Response_) {
            let db = `ManagerAccounts`;
            let coll = `Users`;
            let result = await client.db(`${db}`).collection(`${coll}`).findOne({ UserName: UserName, Password: Password });
            let response_ = result;
            if (response_) {
                let DevicesArr = response_.Devices;
                console.log(DevicesArr)
                let DevicesUpdate = DevicesArr.map((device) => {
                    if (device.NameDevice === NameDevice) {
                        device.Key = NewKey;
                    }
                    return device

                })
                console.log(DevicesUpdate)
                let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ UserName: UserName, Password: Password }, { $set: { Devices: DevicesUpdate } });
                let Response_ = result;
                if (Response_) {
                    return res.status(200).json({
                        message: `Đã cập nhật Key cho thiết bị`,
                        isError: 0
                    });
                }
                else {
                    return res.status(200).json({
                        message: `Quá trình xảy ra lỗi`,
                        isError: 1
                    });
                }
            }
            else {
                return res.status(200).json({
                    message: `Thông tin không chính xác!`,
                    isError: 1
                });
            }
        } else {
            return res.status(200).json({
                message: `Key không chínnh xác!`,
                isError: 1
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

let changeKey = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.NameDevice || !req.body.OldKey || !req.body.NewKey) {
            return res.status(200).json({
                message: `Thông tin không để trống`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let OldKey = req.body.OldKey;
        let NewKey = req.body.NewKey;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`NewKey: ${NewKey}`);
        // console.log(`OldKey: ${OldKey}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;

        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: OldKey });
        let Response_ = result;
        if (Response_) {
            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ NameDevice: NameDevice }, { $set: { Key: NewKey, TimeModify: Date() } });
            // console.log(`${result.matchedCount} document(s) matched the query criteria.`);
            // console.log(`${result.modifiedCount} document(s) was/were updated.`);
            return res.status(200).json({
                message: `Thiết bị ${NameDevice} cật nhật mật khẩu thành công`,
                isError: 0
            });

        }
        else {
            return res.status(200).json({
                message: `Thông tin thiết bị không chính xác`,
                isError: 1
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

let resetKey = async (req, res) => {

    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        if (!req.body.KeySecurity || !req.body.NameDevice) {
            return res.status(200).json({
                message: `Thông tin không để trống`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let KeySecurity = req.body.KeySecurity;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`KeySecurity : ${KeySecurity}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;

        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, KeySecurity: KeySecurity });
        let Response_ = result;
        if (Response_) {


            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ NameDevice: NameDevice }, { $set: { Key: "admin", TimeModify: Date() } });
            // console.log(`${result.matchedCount} document(s) matched the query criteria.`);
            // console.log(`${result.modifiedCount} document(s) was/were updated.`);
            return res.status(200).json({
                message: `Thiết bị ${NameDevice} reset thành công`,
                isError: 0
            });

        }
        else {
            return res.status(200).json({
                message: `Thông tin thiết bị không chính xác`,
                isError: 1
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

let getKey = async (req, res) => {

    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        if (!req.body.KeySecurity || !req.body.NameDevice) {
            return res.status(200).json({
                message: `Thông tin không để trống`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let KeySecurity = req.body.KeySecurity;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`KeySecurity : ${KeySecurity}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;

        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, KeySecurity: KeySecurity });
        let Response_ = result;
        if (Response_) {
            return res.status(200).json({
                message: `Qúa trình hoàn tất`,
                isError: 0,
                Key: Response_.Key
            });

        }
        else {
            return res.status(200).json({
                message: `Thông tin thiết bị không chính xác`,
                isError: 1
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }




}

let sendData = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.NameDevice || !req.body.Key || !req.body.Status) {
            return res.status(200).json({
                message: `Thông tin không để trống.`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let Key = req.body.Key;
        let Status = req.body.Status;
        let sample = { Status: Status, TimeModify: Date() }
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`Key: ${Key}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        let timeformat = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' });
        console.log(`timeformat: ${timeformat}`)
        let today = new Date()
        let date = today.getDate();
        console.log(`date : ${date}`)
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: Key });
        let Response_ = result;
        if (Response_) {

            // console.log(result.NameDevice);
            db = Response_.Type;
            coll = Response_.NameDevice;
            sample = { Status: Status, TimeModify: Date(timeformat) }
            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ Date: date, Month: month, Year: year }, { $push: { samples: sample } }, { upsert: true });
            // console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
            // console.log(result.insertedIds);
            return res.status(200).json({
                message: `Thiết bị ${NameDevice} thêm dữ liệu thành công`,
                isError: 0
            });
        }
        else {
            return res.status(200).json({
                message: `Thiết bị đã được thay đổi Key`,
                isError: 1,
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 0
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}


let readData = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.NameDevice || !req.body.Key) {
            return res.status(200).json({
                message: `Thông tin không để trống!`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let Key = req.body.Key;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`Key: ${Key}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: Key });
        // console.log(result);
        let Response_ = result;
        if (Response_) {
            db = Response_.Type;
            coll = Response_.NameDevice;
            let today = new Date();
            let date = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            let result = await client.db(`${db}`).collection(`${coll}`).findOne({ Date: date, Month: month, Year: year });
            let response_ = result;
            if (response_) {
                let obj = response_.samples;
                let lastItem = Object.keys(obj).length - 1;
                if (lastItem < 0) {
                    lastItem = 0;
                }
                return res.status(200).json({
                    message: `Thiết bị ${NameDevice} đọc dữ liệu thành công`,
                    isError: 0,
                    DataResult: obj[lastItem].Status
                });
            } else {
                return res.status(200).json({
                    message: `Dữ liệu trống`,
                    isError: 1,
                });
            }
        }

        else {
            return res.status(200).json({
                message: `Thiết bị đã được thay đổi Key`,
                isError: 1,
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}


let sendData_KeySecurity = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.NameDevice || !req.body.KeySecurity || !req.body.Status) {
            return res.status(200).json({
                message: `Thông tin không để trống.`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let KeySecurity = req.body.KeySecurity;
        let Status = req.body.Status;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`KeySecurity: ${KeySecurity}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        let timeformat = Date().toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' });
        console.log(timeformat)
        let today = new Date(timeformat)
        let date = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, KeySecurity: KeySecurity });
        let Response_ = result;
        if (Response_) {
            // console.log(result.NameDevice);
            db = Response_.Type;
            coll = Response_.NameDevice;
            sample = { Status: Status, TimeModify: Date(timeformat) }
            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ Date: date, Month: month, Year: year }, { $push: { samples: sample } }, { upsert: true });
            // console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
            // console.log(result.insertedIds);
            return res.status(200).json({
                message: `Thiết bị ${NameDevice} thêm dữ liệu thành công`,
                isError: 0
            });
        }
        else {
            return res.status(200).json({
                message: `Thiết bị đã được thay đổi Key`,
                isError: 1,
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}


let readData_KeySecurity = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.NameDevice || !req.body.KeySecurity) {
            return res.status(200).json({
                message: `Thông tin không để trống!`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let KeySecurity = req.body.KeySecurity;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`KeySecurity: ${KeySecurity}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        let today = new Date();
        let date = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, KeySecurity: KeySecurity });
        let Response_ = result;
        // console.log(result);  
        if (Response_) {
            db = Response_.Type;
            coll = Response_.NameDevice;
            let today = new Date();
            let date = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            let result = await client.db(`${db}`).collection(`${coll}`).findOne({ Date: date, Month: month, Year: year });
            let response_ = result;
            if (response_) {
                let obj = response_.samples;
                let lastItem = Object.keys(obj).length - 1;
                if (lastItem < 0) {
                    lastItem = 0;
                }
                return res.status(200).json({
                    message: `Thiết bị ${NameDevice} đọc dữ liệu thành công`,
                    isError: 0,
                    DataResult: obj[lastItem].Status
                });
            } else {
                return res.status(200).json({
                    message: `Dữ liệu trống`,
                    isError: 1,
                });
            }
        }
        else {
            return res.status(200).json({
                message: `Thiết bị đã được thay đổi Key`,
                isError: 1,
            });
        }


    }
    catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

let keep_Alive = async (req, res) => {

    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        if (!req.body.KeySecurity || !req.body.NameDevice || !req.body.RSSI) {
            return res.status(200).json({
                message: `Yêu cầu tên đăng nhập và mật khẩu để truy cập Database.`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let KeySecurity = req.body.KeySecurity;
        let RSSI = req.body.RSSI;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`KeySecurity : ${KeySecurity}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        let timeformat = Date().toLocaleString('en-GB', { timeZone: 'Asia/Bangkok' });
        let time_now = Date(timeformat);
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, KeySecurity: KeySecurity });
        let Response_ = result;
        if (Response_) {


            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ NameDevice: NameDevice, KeySecurity: KeySecurity }, {
                $set: {

                    keep_Alive: {
                        TimeAlive: time_now,
                        RSSI: RSSI
                    }


                }
            });
            // console.log(`${result.matchedCount} document(s) matched the query criteria.`);
            // console.log(`${result.modifiedCount} document(s) was/were updated.`);
            return res.status(200).json({
                message: `Thiết bị ${NameDevice} đang giữ kết nối với server`,
                isError: 0
            });

        }
        else {
            return res.status(200).json({
                message: `Thiết bị đã được thay đổi Key`,
                isError: 1,
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

let setSchedule = async (req, res) => {

    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        if (!req.body.NameDevice || !req.body.Key) {
            return res.status(200).json({
                message: `Yêu cầu tên đăng nhập và mật khẩu để truy cập Database.`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let Key = req.body.Key;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`Key : ${Key}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        let req_BD = false;
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: Key });
        let Response_ = result;
        if (Response_) {
            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ NameDevice: NameDevice }, {
                $set: {
                    set_Schedule: {
                        Enable: req.body.EnableSchedule,
                        setting: {

                            TimeON_s: {
                                TimeON_hours_s: req.body.TimeON_hours_s,
                                TimeON_minutes_s: req.body.TimeON_minutes_s,
                            },
                            TimeON_e: {
                                TimeON_hours_e: req.body.TimeON_hours_e,
                                TimeON_minutes_e: req.body.TimeON_minutes_e,
                            },
                            TimeOFF_s: {
                                TimeOFF_hours_s: req.body.TimeOFF_hours_s,
                                TimeOFF_minutes_s: req.body.TimeOFF_minutes_s,
                            },
                            TimeOFF_e: {
                                TimeOFF_hours_e: req.body.TimeOFF_hours_e,
                                TimeOFF_minutes_e: req.body.TimeOFF_minutes_e,
                            },

                        },
                        TimeModify: Date()
                    }
                }
            });
            // console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
            // console.log(result.insertedIds);
            return res.status(200).json({
                message: `Thiết bị ${NameDevice} thêm dữ liệu thành công`,
                isError: 0
            });

        }
        else {
            return res.status(200).json({
                message: `Thiết bị đã được thay đổi Key`,
                isError: 1,
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}


let checkAlive = async (req, res) => {

    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.NameDevice || !req.body.Key) {
            return res.status(200).json({
                message: `Thông tin không để trống!`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let Key = req.body.Key;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`Key: ${Key}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: Key });
        // console.log(result);
        let Response_ = result;
        if (Response_) {
            let time_past = new Date(Response_.keep_Alive.TimeAlive);
            let time_now = new Date();
            // console.log(`Response_.keep_Alive.TimeAlive ${Response_.keep_Alive.TimeAlive}`)
            // console.log(`time_past ${time_past}`)
            // console.log(`time_now ${time_now}`)

            let AmountOfTime = (time_now.getTime() - time_past.getTime()) / 1000;


            console.log(AmountOfTime)
            if (AmountOfTime < 10) {
                return res.status(200).json({
                    message: `Cường độ tín hiệu: ${Response_.keep_Alive.RSSI}`,
                    isError: 0,
                });
            }
            else {
                return res.status(200).json({
                    message: `Thiết bị mất kết nối với Wifi!`,
                    isError: 1,
                });
            }
        }
        else {
            return res.status(200).json({
                message: `Thiết bị đã được thay đổi Key`,
                isError: 1,
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

let loadSchedule = async (req, res) => {

    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.NameDevice || !req.body.Key) {
            return res.status(200).json({
                message: `Thông tin không để trống!`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let Key = req.body.Key;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`Key: ${Key}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: Key });
        // console.log(result);
        let Response_ = result;
        if (Response_) {
            console.log(Response_.set_Schedule.Enable)

            return res.status(200).json({
                message: `Quá trình hoàn tất `,
                isError: 0,
                DataResult: Response_.set_Schedule
            });

        }
        else {
            return res.status(200).json({
                message: `Thiết bị đã được thay đổi Key`,
                isError: 1,
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

let getTimeline = async (req, res) => {

    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.NameDevice || !req.body.Key || !req.body.Date || !req.body.Month || !req.body.Year) {
            return res.status(200).json({
                message: `Thông tin không để trống!`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let Key = req.body.Key;
        let Date = req.body.Date;
        let Month = req.body.Month;
        let Year = req.body.Year;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`Key: ${Key}`);
        // console.log(`Date: ${Date}`);
        // console.log(`Month: ${Month}`);
        // console.log(`Year: ${Year}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: Key });
        // console.log(result);
        let Response_ = result;
        if (Response_) {
            let db = `${Response_.Type}`;
            let coll = `${NameDevice}`;
            // console.log(`db: ${db}`)
            // console.log(`coll: ${coll}`)

            let result = await client.db(`${db}`).collection(`${coll}`).findOne({ Date: Number(Date), Month: Number(Month), Year: Number(Year) });
            if (result) {
                return res.status(200).json({
                    message: `Quá trình hoàn tất `,
                    isError: 0,
                    DataResult: result.samples
                });
            }
            else {
                return res.status(200).json({
                    message: `Không có dữ liệu`,
                    isError: 1,
                });
            }
        }
        else {
            return res.status(200).json({
                message: `Thông tin thiết bị không chính xác`,
                isError: 1,
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
            isError: 1
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}




module.exports = {
    changeKey, resetKey, sendData, readData, readData_KeySecurity, sendData_KeySecurity, keep_Alive, setSchedule, checkAlive, loadSchedule, updateKey,
    getKey, getTimeline
}