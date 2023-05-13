const express = require('express');
const Database = require('better-sqlite3');
const db = new Database('database/db.db', { verbose: console.log });
const authMiddleware = require('./middlewares/auth').checkToken;
db.pragma('journal_mode = WAL');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routes/auth');
const cardRouter = require('./routes/card');
const relationRouter = require('./routes/relation');
const memoRouter = require('./routes/memo');

app.use('/auth', authRouter);
app.use('/card', authMiddleware, cardRouter);
app.use('/relation', authMiddleware, relationRouter);
app.use('/memo', authMiddleware, memoRouter);

app.listen (3000, () => {
	console.log('server is running on port 3000');
});