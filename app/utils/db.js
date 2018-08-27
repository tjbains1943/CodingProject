const debug = require('debug')('app:db');

const mongoose = require('mongoose');
const dbName = process.env.DATABASE_NAME || 'AppDatabase'
const mongoDB = 'mongodb://127.0.0.1/' + dbName;
mongoose.connect(mongoDB);
const db = mongoose.connection;

debug(`Using database: ${mongoDB}`);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
