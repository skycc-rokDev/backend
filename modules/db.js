const Database = require('better-sqlite3');
const db = new Database('database/db.db', { verbose: console.log });

db.pragma('journal_mode = WAL');

module.exports = db;