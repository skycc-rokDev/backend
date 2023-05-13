// auth  controller
const jwt = require('../modules/jwt');
const MSG = require('../modules/responseMessage');
const CODE = require('../modules/statusCode');
const db = require('../modules/db');
const bcrypt = require('bcrypt');
const hashing = require('../modules/hash');

exports.register = async (req, res, next) => {
	const email = req.body.email? req.body.email : '';
	const password = req.body.password? req.body.password : '';

	// check if email and password are set
	if (email == '' || password == '') {
		res.status(400).send({'status': CODE.BAD_REQUEST, 'message': MSG.MISSING_PARAMETERS});
		return;
	}
	// check email is valid with regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		res.status(400).send({'status': CODE.BAD_REQUEST, 'message': MSG.INVALID_EMAIL});
		return;
	}

	// add email and password to database
	hashing(password).then(async (hash) => {
		db.serialize();
		const stmt = db.prepare('INSERT INTO user_auth (email, password) VALUES (?, ?);').run(email, hash);
		if (!stmt) {
			res.status(500).send({'status': CODE.BAD_REQUEST, 'message': MSG.ALREADY_EXIST_EMAIL});
			return;
		}
		const token = await jwt.sign({email: email});
		res.status(200).send({'status': CODE.OK, 'message': MSG.REGISTER_SUCCESS, 'token': token});
		return;
	});
};

exports.login = async (req, res, next) => {
	const email = req.body.email? req.body.email : '';
	const password = req.body.password? req.body.password : '';

	// check if email and password are set
	if (email == '' || password == '') {
		return res.status(400).send({'status': CODE.BAD_REQUEST, 'message': MSG.MISSING_PARAMETERS});
	}
	// check email is valid with regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).send({'status': CODE.BAD_REQUEST, 'message': MSG.INVALID_EMAIL});
	}

	// check if email exists in database
	db.serialize();
	const stmt = db.prepare('SELECT * FROM user_auth WHERE email = ?;').get(email);
	if (!stmt || typeof stmt != 'object') {
		return res.status(400).send({'status': CODE.BAD_REQUEST, 'message': MSG.INVALID_EMAIL});
	}
	// check if stmt has password
	const result = await bcrypt.compare(password, stmt['password']);
	if (!result) {
		return res.status(401).send({'status': CODE.UNAUTHORIZED, 'message': MSG.LOGIN_FAIL});
	}
	else
	{
		// create token
		const token = await jwt.sign(stmt);
		return res.status(200).send({'status': CODE.OK, 'message': MSG.LOGIN_SUCCESS, 'token': token});
	}
};