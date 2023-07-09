const { model } = require('mongoose');
const { serverURL } = require('../../config');

module.exports = async function (req, res) {
	const chats = await model('Chat').find({ deleted: false });

	res.render('pages/home', {
		title: 'Home',
		serverURL,
		chats: chats,
		messages: []
	});
};
