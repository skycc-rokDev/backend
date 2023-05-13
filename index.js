const express = require('express');
const Database = require('better-sqlite3');
const db = new Database('database/db.db', { verbose: console.log });
db.pragma('journal_mode = WAL');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routes/auth');

app.use('/auth', authRouter);

app.listen (3000, () => {
	console.log('server is running on port 3000');
});