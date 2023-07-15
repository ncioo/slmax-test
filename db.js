const mongoose = require('mongoose');
const { dbHost, dbPort, dbName } = require('./config');

//  Загружаем модели
const models = require('./models');

//  Инициализируем подключение к базе данных
module.exports = mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`);
