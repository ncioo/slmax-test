const { model } = require('mongoose');

module.exports = async function (req, res) {
	//	Получаем данные из тела запроса
	const { email, password } = req.body;

	//	Аутентификация пользователя через модель User
	const { user, error } = await model('User').authenticate()(email, password);

	//	Проверяем на наличие ошибки
	if (error) {
		if (error.name === 'IncorrectUsernameError' || error.name === 'IncorrectPasswordError') {
			//	Возвращаем ошибку если неверный логин или пароль
			res.json({
				success: false,
				error: 'Неверный логин или пароль'
			});
		} else {
			//	Возвращаем ошибку если что-то пошло не так
			res.json({ success: false, error: error });
		}
	}

	// Логин пользователя
	req.login(user, () => {
		//	Добавляем объект пользователя в сессию
		req.session.user = user;

		//	Возвращаем объект пользователя и флаг об успешном выполнении запроса
		res.json({
			success: true,
			user: user
		});
	});
};
