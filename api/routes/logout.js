module.exports = function (req, res) {
	// Логаут пользователя
	req.logout(() => {
		//	Удаляем объект пользователя из сессии
		req.session.user = null;

		//	Возвращаем флаг об успешном выполнении запроса
		res.json({
			success: true
		});
	});
};
