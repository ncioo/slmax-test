const login = require('./login');
const register = require('./register');
const getChat = require('./chat');
const root = require('./root');
const logout = require('./logout');

module.exports = function (app) {
	app.get('/', root);

	app.post('/login', login);

	app.post('/register', register);

	app.post('/logout', logout);

	app.get('/chat/:id', getChat);
};
