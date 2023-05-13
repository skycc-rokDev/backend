const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashing = async (password) => {
	const salt = await bcrypt.genSalt(saltRounds);
	const hash = await bcrypt.hash(password, salt);

	return hash;
}

module.exports = hashing;