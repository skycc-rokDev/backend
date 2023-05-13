const jwt = require('../modules/jwt');
const MSG = require('../modules/responseMessage');
const CODE = require('../modules/statusCode');
const db = require('../modules/db');
const crypto = require('crypto');

exports.addCard = async (req, res, next) => {
	const email = await req.email;
	const name = req.body.name;
	const company = req.body.company;
	const phone = req.body.phone;
	const address = req.body.address;
	const site = req.body.site;
	const role = req.body.role;
	const email2 = req.body.email2; // card email
	const cardId = crypto.randomUUID();

	if (!email || !name || !company || !phone || !address || !site || !role || !email2) {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.MISSING_PARAMETERS});
		return;
	}

	db.serialize();
	const stmt = db.prepare('INSERT INTO card (email, name, company, phone, address, site, role, email2, uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);')
		.run(email, name, company, phone, address, site, role, email2, cardId);
	if (!stmt) {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.ADD_CARD_FAIL});
		return;
	}
	return res.status(CODE.OK).send({'status': CODE.OK, 'message': MSG.ADD_CARD_SUCCESS});
};

exports.listCard = async (req, res, next) => { // list my cards
	return;
}

exports.MyCard = async (req, res, next) => {
	const email = req.email;
	
	db.serialize();
	const stmt = db.prepare('SELECT * FROM card WHERE email = ?;').get(email);
	if (!stmt || typeof stmt != 'object') {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.GET_MY_CARD_FAIL});
		return;
	}
	console.log(stmt);
	return res.status(CODE.OK).send({'status': CODE.OK, 'message': MSG.GET_MY_CARD_SUCCESS, 'data': stmt});
};

exports.deleteCard = async (req, res, next) => {
	return;
}
