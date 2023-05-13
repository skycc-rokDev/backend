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

exports.listCard = async (req, res, next) => { // list
	const email = req.email;

	db.serialize();
	const stmt = db.prepare('SELECT * FROM relation WHERE (email1 = ? OR email2 = ?);').all(email, email);
	if (!stmt || typeof stmt != 'object') {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.GET_CARD_LIST_FAIL});
		return;
	}
	let result = [];
	stmt.forEach((element, index) => {
		const requestEmail = element.email1 == email ? element.email2 : element.email1;
		const stmt2 = db.prepare('SELECT * FROM card WHERE email = ?;').get(requestEmail);
		if (!stmt2 || typeof stmt2 != 'object')
			return;
		result.push(stmt2);
	});
	return res.status(CODE.OK).send({'status': CODE.OK, 'message': MSG.GET_CARD_LIST_SUCCESS, 'data': result});
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
	const email = req.email;
	
	if (!email) {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.MISSING_PARAMETERS});
		return;
	}

	db.serialize();
	const stmt = db.prepare('DELETE FROM card WHERE email = ?;').run(email);
	if (!stmt) {
		res.status(CODE.BAD_REQUEST).send({'status': CODE.BAD_REQUEST, 'message': MSG.DELETE_CARD_FAIL});
		return;
	}
	return res.status(CODE.OK).send({'status': CODE.OK, 'message': MSG.DELETE_CARD_SUCCESS});
}
