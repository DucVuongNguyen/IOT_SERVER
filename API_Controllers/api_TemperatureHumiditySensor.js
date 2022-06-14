const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

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
let sendData_KeySecurity = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.NameDevice || !req.body.KeySecurity || !req.body.Humidity || !req.body.Temperature) {
            return res.status(200).json({
                message: `Thông tin không để trống.`,
                isError: 1
            });
        }
        let NameDevice = req.body.NameDevice;
        let KeySecurity = req.body.KeySecurity;
        let Temperature = req.body.Temperature;
        let Humidity = req.body.Humidity;
        // console.log(`NamDoc: ${NameDevice}`);
        // console.log(`KeySecurity: ${KeySecurity}`);
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        let today = new Date()
        console.log(`today: ${today}`)
        let date = today.getDate();
        console.log(`date : ${date}`)
        let month = today.getMonth() + 1;
        console.log(`month : ${month}`)
        let year = today.getFullYear();
        console.log(`year : ${year}`)
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, KeySecurity: KeySecurity });
        let Response_ = result;
        if (Response_) {
            // console.log(result.NameDevice);
            db = Response_.Type;
            coll = Response_.NameDevice;
            sample = { Humidity: Humidity, Temperature: Temperature, TimeModify: new Date().toString() }
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

module.exports = {
    getKey,sendData_KeySecurity
}