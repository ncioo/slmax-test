const { model } = require('mongoose');

module.exports = async function (req, res) {
	//	Получаем данные из тела запроса
	const { username, email, password } = req.body;

	try {
		//	Создаем пользователя через функцию создания из модели User
		//	и передаем имя пользователя, емеил и пароль
		const user = await model('User').createAccount(username, email, password);

		//	Добавляем объект пользователя в сессию
		req.session.user = user;

		//	Возвращаем объект пользователя и флаг об успешном выполнении запроса
		res.json({ success: true, user: user });
	} catch (error) {
		//	Возвращаем ошибку если что-то пошло не так
		res.json({ success: false, error: error });
	}
};
