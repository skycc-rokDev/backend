const MSG = require('../modules/responseMessage');
const CODE = require('../modules/statusCode');
const db = require('../modules/db');

exports.addMemo = async (req, res, next) => {
	const email = await req.email;
	const cardId = req.body.cardId;
	const memo = req.body.memo? req.body.memo : ' ';

	if (!email || !cardId || !memo) {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.MISSING_PARAMETERS});
		return;
	}

	db.serialize();
	const stmt = db.prepare('INSERT INTO memo (email, cardId, memo) VALUES (?, ?, ?);').run(email, cardId, memo);
	if (!stmt) {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.ADD_MEMO_FAIL});
		return;
	}
	return res.status(CODE.OK).send({'status': CODE.OK, 'message': MSG.ADD_MEMO_SUCCESS});
};

exports.getMemo = async (req, res, next) => {
	const email = await req.email;
	const cardId = req.body.cardId;

	if (!email || !cardId) {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.MISSING_PARAMETERS});
		return;
	}

	db.serialize();
	const stmt = db.prepare('SELECT * FROM memo WHERE email=? AND cardId=?;').get(email, cardId);
	if (!stmt) {
		res.status(CODE.OK).send({'status': CODE.OK, 'message': MSG.GET_MEMO_SUCCESS, 'data': {
			"email": email,
			"cardId": cardId,
			"memo": ""
		}});
		return;
	}
	return res.status(CODE.OK).send({'status': CODE.OK, 'message': MSG.GET_MEMO_SUCCESS, 'data': stmt});
}