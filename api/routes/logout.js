module.exports = function (req, res) {
	// Логаут пользователя
	req.logout(() => {
		//	Удаляем объект пользователя из сессии
		req.session.user = null;
		res.json({
			//	Возвращаем флаг об успешном выполнении запроса
			success: true
		});
	});
};
