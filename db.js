const mongoose = require('mongoose');

const { dbHost, dbPort, dbName } = require('./config');

const models = require('./models');

module.exports = mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`);
