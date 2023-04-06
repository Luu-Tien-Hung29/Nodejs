const Course = require("../models/Course.models");
const TABLENAME = "users";
const Users = require("../models/Users.models");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const authMethod = require("../../method/auth.method");
const randToken = require("rand-token");
const jwt = require("jsonwebtoken");

const getUser = async (username) => {
  try {
    const data = await Users.findOne({ phoneNumber: username });
    console.log(data, "data");
    return data;
  } catch {
    return null;
  }
};
const createUsers = async (user) => {
  console.log("Users:", Users);
  const userNew = await Users.create(user);
  if (userNew) {
    return true;
  } else {
    return false;
  }
};

class authControllers {
  // [get]/
  home(req, res, next) {
    const getCource = async () => {
      Course.find({})
        .then((cources) => {
          const dataSend = {
            responseCode: 200,
            data: cources,
            type: "Success",
          };
          res.json(dataSend);
        })
        .catch((error) => next(error));
    };
    getCource();
  }
  // [get]/search
  login = async (req, res) => {
    const username = req.body.userName.toLowerCase();
    const password = req.body.password;
    const save = req.body.savePass;
    const user = await getUser(username);
    console.log(user, "user");
    const dataSend = { ...user };

    if (!username || !password) {
      return res.status(200).json({
        responseCode: 201,
        message: "Nhập đầy đủ tên tài khoản và mật khẩu",
        type: "Error",
      });
    }
    if (!user) {
      return res.status(200).json({
        responseCode: 202,
        message: "Tài khoản không tồn tại",
        type: "Error",
      });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        responseCode: 203,
        message: "Mật khẩu không chính xác.",
        type: "Error",
      });
    }
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const dataForAccessToken = {
      username: user.phoneNumber,
    };
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    if (!accessToken) {
      return res.status(200).json({
        responseCode: 203,
        message: "Đăng nhập không thành công, vui lòng thử lại.",
        type: "Error",
      });
    }
    let refreshToken = jwt.sign(dataForAccessToken, process.env.REFRESH_TOKEN, {
      expiresIn: "30d",
    });
    if (!user.refreshToken) {
      const countUpdate = user.__v + 1;
      await Users.updateOne(
        { phoneNumber: user.phoneNumber },
        {
          $set: {
            refreshToken: refreshToken,
            __v: countUpdate,
            updateddAt: new Date(),
          },
        },
        { upsert: true }
      );
    } else {
      refreshToken = user.refreshToken;
    }
    await Users.updateOne(
      { phoneNumber: user.phoneNumber },
      { $set: { savePass: save, updateddAt: new Date() } },
      { upsert: true }
    );
    console.log(dataSend, "123");
    delete dataSend._doc.password;
    return res.json({
      responseCode: 200,
      message: "Đăng nhập thành công.",
      type: "Success",
      data: {
        accessToken,
        refreshToken,
        user: dataSend._doc,
      },
    });
  };
  register = async (req, res) => {
    const username = req.body.userName.toLowerCase();
    const user = await getUser(username);
    if (!!user) {
      res.status(200).json({
        responseCode: 201,
        message: "Tên tài khoản đã tồn tại.",
        type: "Error",
      });
    } else if (req.body.password != req.body.confirmPassword) {
      res.status(200).json({
        responseCode: 203,
        message: "Mật khẩu và mật khẩu xác nhận phải giống nhau",
        type: "Error",
      });
    } else {
      const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
      const newUser = {
        phoneNumber: username,
        password: hashPassword,
      };
      const createUser = await createUsers(newUser);
      if (!createUser) {
        return res.status(200).json({
          responseCode: 202,
          message: "Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.",
          type: "Error",
        });
      }
      return res.json({
        responseCode: 200,
        message: "Đăng ký thành công!",
        type: "Success",
      });
    }
  };
  refreshToken = async (req, res) => {
      // Lấy access token từ header
      const accessTokenFromHeader = req.headers.x_authorization;
      if (!accessTokenFromHeader) {
        return res.status(200).json({
          responseCode: 201,
          message: "Không tìm thấy access token.",
          type: "Error",
        });
      }

      // Lấy refresh token từ body
      const refreshTokenFromBody = req.body.refreshToken;
      if (!refreshTokenFromBody) {
        return res.status(200).json({
            responseCode: 202,
            message: "Không tìm thấy refresh token.",
            type: "Error",
          });
      }

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

      // Decode access token đó
      const decoded = await authMethod.decodeToken(
        accessTokenFromHeader,
        accessTokenSecret
      );
      if (!decoded) {
        return res.status(200).json({
            responseCode: 203,
            message: "Access token không hợp lệ.",
            type: "Error",
          });
      }

      const username = decoded.payload.username; // Lấy username từ payload

      const user = await userModel.getUser(username);
      if (!user) {
        return res.status(200).json({
            responseCode: 204,
            message: "User không tồn tại.",
            type: "Error",
          });
      }

      if (refreshTokenFromBody !== user.refreshToken) {
        return res.status(200).json({
            responseCode: 205,
            message: "Refresh token không hợp lệ.",
            type: "Error",
          });
      }

      // Tạo access token mới
      const dataForAccessToken = {
        username,
      };

      const accessToken = await authMethod.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife
      );
      if (!accessToken) {
        return res.status(200).json({
            responseCode: 206,
            message:"Tạo access token không thành công, vui lòng thử lại.",
            type: "Error",
          });
      }
      return res.status(200).json({
        responseCode: 200,
        message: "Success!",
        type: "Success",
        data:{accessToken}
      });
    };
  };

module.exports = new authControllers();
