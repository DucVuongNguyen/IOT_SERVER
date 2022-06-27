const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

let addDevice = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {

        if (!req.body.UserName || !req.body.Password || !req.body.NameDevice || !req.body.Key || !req.body.Type) {
            return res.status(200).json({
                message: `Thông tin không để trống!`,
                isError: 1
            });
        }
        let UserName = req.body.UserName;
        let Password = req.body.Password;
        let NameDevice = req.body.NameDevice;
        let Key = req.body.Key;
        let Type = req.body.Type;
        let db = `ManagerAccounts`;
        let coll = `Users`;
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ UserName: UserName, Password: Password });
        if (result) {
            // console.log(result.Devices)
            let DevicesArr = result.Devices;
            let hasDevice = false;
            let Arr = DevicesArr.map((device) => {
                if (device.NameDevice === NameDevice) {
                    hasDevice = true;
                }
            })
            console.log(hasDevice)
            if (!hasDevice) {
                let Device = {

                    NameDevice: NameDevice,
                    NameDeviceCustom: NameDevice,
                    Key: Key,
                    Type: Type,
                }

                let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ UserName: UserName, Password: Password }, { $push: { Devices: Device } });
                if (result) {
                    let result = await client.db(`${db}`).collection(`${coll}`).findOne({ UserName: UserName, Password: Password });

                    return res.status(200).json({
                        message: `Thiết bị đã được thêm`,
                        isError: 0,
                        user: result
                    });
                }
                else {
                    return res.status(200).json({
                        message: `Quá trình thêm thiết bị xảy ra lỗi`,
                        isError: 1
                    });
                }

            }
            else {
                return res.status(200).json({
                    message: `Thiết bị ${NameDevice} đã tồn tại!`,
                    isError: 1
                });

            }

        }
        else {
            return res.status(200).json({
                message: `Quá trình xảy ra lỗi!`,
                isError: 1
            });

        }

    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình xảy ra lỗi!`,
            isError: 0
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

let deleteDevice = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {

        if (!req.body.UserName || !req.body.Password || !req.body.NameDevice) {
            return res.status(200).json({
                message: `Thông tin không để trống!`,
                isError: 1
            });
        }
        let UserName = req.body.UserName;
        let Password = req.body.Password;
        let NameDevice = req.body.NameDevice;
        let db = `ManagerAccounts`;
        let coll = `Users`;
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ UserName: UserName, Password: Password });
        let Response_ = result;
        if (Response_) {
            let DevicesArr = Response_.Devices;
            let Device = DevicesArr.filter((device) => {
                return device.NameDevice !== NameDevice;
            });


            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ UserName: UserName, Password: Password }, { $set: { Devices: Device } });
            if (result) {
                let result = await client.db(`${db}`).collection(`${coll}`).findOne({ UserName: UserName, Password: Password });

                return res.status(200).json({
                    message: `Thiết bị đã được xóa`,
                    isError: 0,
                    user: result
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
                message: `Quá trình xảy ra lỗi!`,
                isError: 1
            });

        }

    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình xảy ra lỗi!`,
            isError: 0
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }


}

let renameDevice = async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {

        if (!req.body.UserName || !req.body.Password || !req.body.NameDevice || !req.body.RenameDevice) {
            return res.status(200).json({
                message: `Thông tin không để trống!`,
                isError: 1
            });
        }
        let UserName = req.body.UserName;
        let Password = req.body.Password;
        let NameDevice = req.body.NameDevice;
        let RenameDevice = req.body.RenameDevice;
        let db = `Devices_Manager`;
        let coll = `Devices_`;
        await client.connect();
        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ NameDevice: NameDevice, Key: Key });
        let Response_ = result;
        if (Response_) {
            let DevicesArr = Response_.Devices;
            let Device = DevicesArr.filter((device) => {
                if (device.NameDevice === NameDevice) {
                    device.NameDeviceCustom = RenameDevice

                }
                return device;
            });
            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ UserName: UserName, Password: Password }, { $set: { Devices: Device } });
            if (result) {
                let result = await client.db(`${db}`).collection(`${coll}`).findOne({ UserName: UserName, Password: Password });

                return res.status(200).json({
                    message: `Tên thiết bị đã được thay đổi`,
                    isError: 0,
                    user: result
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
                message: `Quá trình xảy ra lỗi!`,
                isError: 1
            });

        }

    } catch (e) {
        console.error(e);
        return res.status(200).json({
            message: `Quá trình xảy ra lỗi!`,
            isError: 0
        });
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }


}
let changeKey = async (req, res) => {

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
            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ NameDevice: NameDevice }, { $set: { Key: NewKey, TimeModify: Date() } });
            // console.log(`${result.matchedCount} document(s) matched the query criteria.`);
            // console.log(`${result.modifiedCount} document(s) was/were updated.`);
            if (result) {
                let db = `ManagerAccounts`;
                let coll = `Users`;
                let result = await client.db(`${db}`).collection(`${coll}`).findOne({ UserName: UserName, Password: Password });
                let Response__ = result;
                if (Response__) {
                    let DevicesArr = Response__.Devices;
                    let Device = DevicesArr.filter((device) => {
                        if (device.NameDevice === NameDevice) {
                            device.Key = NewKey

                        }
                        return device;
                    });
                    let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ UserName: UserName, Password: Password }, { $set: { Devices: Device } });
                    let Response___ = result;
                    if (Response___) {
                        let result = await client.db(`${db}`).collection(`${coll}`).findOne({ UserName: UserName, Password: Password });
                        let Response____ = result;
                        if (Response____) {
                            return res.status(200).json({
                                message: `Key thiết bị đã được thay đổi`,
                                isError: 0,
                                user: Response____
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
            let result = await client.db(`${db}`).collection(`${coll}`).updateOne({ NameDevice: NameDevice, KeySecurity: KeySecurity }, { $set: { Key: 'admin' } });
            if (result) {
                return res.status(200).json({
                    message: `ResetKey thành công`,
                    isError: 0,
                    Key: Response_.Key
                });
            } else {
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

module.exports = {
    addDevice, deleteDevice, renameDevice, changeKey, getKey, resetKey

}