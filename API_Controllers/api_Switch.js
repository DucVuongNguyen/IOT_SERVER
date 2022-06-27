const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

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
let updateKey = async (req, res) => {

    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        if (!req.body.Key || !req.body.NameDevice || !req.body.NewKey || !req.body.UserName || !req.body.Password) {
            return res.status(200).json({
                message: `Thông tin không để trống`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let Key = req.body.Key;
        let NewKey = req.body.NewKey;
        let UserName = req.body.UserName;
        let Password = req.body.Password;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`KeySecurity : ${KeySecurity}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;

        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: Key });
        let Response_ = result;
        if (Response_) {

            let db = `ManagerAccounts`;
            let coll = `Users`;
            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ NameDevice: NameDevice }, { $set: { Key: NewKey, TimeModify: Date() } });
            // console.log(`${result.matchedCount} document(s) matched the query criteria.`);
            // console.log(`${result.modifiedCount} document(s) was/were updated.`);
            if (result) {
                let result = await client.db(`${db}`).collection(`${coll}`).findOne({ UserName: UserName, Password: Password });
                if (result) {
                    let DevicesArr = result.Devices;
                    let Device = DevicesArr.filter((device) => {
                        if (device.NameDevice === NameDevice) {
                            device.Key = NewKey

                        }
                        return device;
                    });
                    let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ UserName: UserName, Password: Password }, { $set: { Devices: Device } });
                    if (result) {
                        return res.status(200).json({
                            message: `Cật nhật Key thành công`,
                            isError: 0,
                            Devices: Device
                        });
                    }
                    else {
                        return res.status(200).json({
                            message: `Quá trình xảy ra lỗi`,
                            isError: 1
                        });
                    }

                } else {
                    return res.status(200).json({
                        message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
                        isError: 1
                    });
                }
            }
            else {
                return res.status(200).json({
                    message: `Quá trình kết nối xảy ra lỗi! Vui lòng thực hiện lại.`,
                    isError: 1
                });

            }

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
        let today = new Date()
        // console.log(`today: ${today}`)
        let date = today.getDate();
        // console.log(`date : ${date}`)
        let month = today.getMonth() + 1;
        // console.log(`month : ${month}`)
        let year = today.getFullYear();
        // console.log(`year : ${year}`)
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: Key });
        let Response_ = result;
        if (Response_) {

            // console.log(result.NameDevice);
            db = Response_.Type;
            coll = Response_.NameDevice;
            sample = { Status: Status, TimeModify: new Date().toString() }
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
    resetKey, sendData, readData,
    getKey, getTimeline, updateKey
}