const { model } = require('mongoose');

module.exports = async function (req, res) {
	const { email, password } = req.body;

	const { user, error } = await model('User').authenticate()(email, password);
	if (error) {
		if (error.name === 'IncorrectUsernameError' || error.name === 'IncorrectPasswordError') {
			res.json({
				success: false,
				error: 'Неверный логин или пароль'
			});
		} else console.error(error);
	}

	req.login(user, () => {
		req.session.user = user;
		res.json({
			success: true,
			user: user
		});
	});
};
