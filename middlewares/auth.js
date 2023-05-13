const jwt = require('../modules/jwt');
const MSG = require('../modules/responseMessage');
const CODE = require('../modules/statusCode');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
	checkToken : (async (req, res, next) => {
        var token = req.headers.token;
        // 토큰 없음
        if (!token)
		{
			req.email = undefined;
			next();
		}
        // decode
        const user = await jwt.verify(token);
        // 유효기간 만료
        if (user === TOKEN_EXPIRED)
            return res.send({"code": CODE.UNAUTHORIZED, "message": MSG.INVALID_TOKEN});
        // 유효하지 않는 토큰
        if (user === TOKEN_INVALID)
            return res.send({"code": CODE.UNAUTHORIZED, "message": MSG.INVALID_TOKEN});
        if (user.email === undefined)
            return res.send({"code": CODE.UNAUTHORIZED, "message": MSG.INVALID_TOKEN});
        req.email = user.email;
		return await next();
    })
}

module.exports = authUtil;