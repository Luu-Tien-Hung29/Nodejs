const Course = require('../models/Course.models')
const TABLENAME = 'users';
const Users = require('../models/Users.models')
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const authMethod = require('../../method/auth.method')
const randToken = require('rand-token')
const jwt = require('jsonwebtoken');

const getUser = async username => {
    try {
        const data = await Users.findOne({ phoneNumber: username });
        console.log(data, 'data');
        return data;
    } catch {
        return null;
    }
};
const createUsers = async user => {
    console.log('Users:', Users)
    const userNew = await Users.create(user)
    if (userNew) {
        return true
    } else {
        return false
    }
};

class authControllers {
    // [get]/
    home(req, res, next) {
        const getCource = async () => {
            Course.find({})
                .then(cources => {
                    const dataSend = {
                        responseCode: 200,
                        data: cources,
                        type: "Success"
                    }
                    res.json(dataSend)
                })
                .catch(error => next(error))

        }
        getCource()
    }
    // [get]/search
    login = async (req, res) => {
        const username = req.body.userName.toLowerCase();
        const password = req.body.password;
        const user = await getUser(username);
        console.log(user,"user");
        const dataSend = {...user}

        if (!username || !password) {
            return res.status(200).json({
                responseCode: 201,
                message: 'Nhập đầy đủ tên tài khoản và mật khẩu',
                type: "Error"
            })
        }
        if (!user) {
            return res.status(200).json({
                responseCode: 202,
                message: 'Tài khoản không tồn tại',
                type: "Error"
            })
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(200).json({
                responseCode: 203,
                message: 'Mật khẩu không chính xác.',
                type: "Error"
            })
        }
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

        const dataForAccessToken = {
            username: user.phoneNumber,
        };
        const accessToken = await authMethod.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );
        if (!accessToken) {
            return res.status(200).json({
                responseCode: 203,
                message: 'Đăng nhập không thành công, vui lòng thử lại.',
                type: "Error"
            })
        }
        let refreshToken = jwt.sign(
            dataForAccessToken,
            process.env.REFRESH_TOKEN,
            { expiresIn: "30d" }
        );
        if (!user.refreshToken) {
            const countUpdate = user.__v + 1
            await Users.updateOne({ phoneNumber: user.phoneNumber }, { $set: { refreshToken: refreshToken, __v: countUpdate, updateddAt: new Date() } }, { upsert: true });
        } else {
            refreshToken = user.refreshToken;
        }
        console.log(dataSend,"123");
        delete dataSend._doc.password
        return res.json({
            responseCode: 200,
            message: 'Đăng nhập thành công.',
            type: "Success",
            data: {
                accessToken,
                refreshToken,
                user: dataSend._doc
            }
        });
    }
    register = async (req, res) => {
        const username = req.body.username.toLowerCase();
        const user = await getUser(username);
        if (!!user) {
            res.status(200).json({
                responseCode: 201,
                message: 'Tên tài khoản đã tồn tại.',
                type: "Error"
            })
        } else if (req.body.password != req.body.cfPassword) {
            res.status(200).json({
                responseCode: 203,
                message: 'Mật khẩu và mật khẩu xác nhận phải giống nhau',
                type: "Error"
            })
        } else {
            const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
            const newUser = {
                phoneNumber: username,
                password: hashPassword,
            };
            const createUser = await createUsers(newUser);
            if (!createUser) {
                return res
                    .status(200)
                    .json({
                        responseCode: 202,
                        message: 'Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.',
                        type: "Error"
                    });
            }
            return res.json({
                responseCode: 200,
                message: 'Success!',
                type: "Success"
            });
        }

    }

}

module.exports = new authControllers();
