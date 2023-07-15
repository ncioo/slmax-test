const login = require('./login');
const register = require('./register');
const getChat = require('./chat');
const root = require('./root');
const logout = require('./logout');

module.exports = function (app) {
	//	Обрабатываем корневой запрос и передаем его в соответствующий обработчик
	app.get('/', root);

	//	Обрабатываем /login запрос и передаем его в соответствующий обработчик
	app.post('/login', login);

	//	Обрабатываем /register запрос и передаем его в соответствующий обработчик
	app.post('/register', register);

	//	Обрабатываем /logout запрос и передаем его в соответствующий обработчик
	app.post('/logout', logout);

	//	Обрабатываем /chat/<someID>/ запрос и передаем его в соответствующий обработчик
	app.get('/chat/:id', getChat);
};
