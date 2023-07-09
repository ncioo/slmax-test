const { model } = require('mongoose');

module.exports = async function (req, res) {
	const { username, email, password } = req.body;

	try {
		const user = await model('User').createAccount(username, email, password);
		req.session.user = user;
		res.json({ success: true, user: user });
	} catch (error) {
		res.json({ success: false, error: error });
	}
};
