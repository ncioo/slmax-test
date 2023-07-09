const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
	dbHost: process.env.DB_HOST, // db host = 127.0.0.1
	dbPort: process.env.DB_PORT, // db port = 27017
	dbName: process.env.DB_NAME, // db name = slmax-laravel-testovoe-zadanie
	serverPort: process.env.SERVER_PORT, // server port = 8080
	serverURL: process.env.SERVER_URL // server url = http://localhost:8080
};

module.exports = config;
