const Users = require("../app/models/Users.models");
const authMethod = require('../method/auth.method');
const getUser = async (username) => {
  try {
    const data = await Users.findOne({ phoneNumber: username });
    console.log(data, "data");
    return data;
  } catch {
    return null;
  }
};

exports.isAuth = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.x_authorization;
	console.log(req.headers,'12345');
	if (!accessTokenFromHeader) {
		return res.status(403).json({
			message:'Không tìm thấy access token!'
		});
	}

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const verified = await authMethod.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	console.log(verified,"::::verified");
	console.log(accessTokenFromHeader,"::::accessTokenFromHeader");
	console.log(accessTokenSecret,"::::accessTokenSecret");
	if (!verified) {
		return res
			.status(403)
			.json({
				message:'Vui lòng đăng nhập để sử dụng tính năng này!'
			});
	}

	const user = await getUser(verified.payload.username);
	req.user = user;

	return next();
};