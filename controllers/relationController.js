const MSG = require('../modules/responseMessage');
const CODE = require('../modules/statusCode');
const db = require('../modules/db');

exports.addRelation = async (req, res, next) => {
	const email1 = await req.email;
	const email2 = req.body.email;

	if (!email1 || !email2) {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.MISSING_PARAMETERS});
		return;
	}

	db.serialize();
	const stmt = db.prepare('INSERT INTO relation (email1, email2) VALUES (?, ?);').run(email1, email2);
	if (!stmt) {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.ADD_RELATION_FAIL});
		return;
	}
	return res.status(CODE.OK).send({'status': CODE.OK, 'message': MSG.ADD_RELATION_SUCCESS});
};