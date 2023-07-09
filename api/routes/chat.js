const { model, Types } = require('mongoose');
const { serverURL } = require('../../config');

module.exports = async function (req, res) {
	const chatId = req.params.id;
	const searchString = req.query?.searchString;

	const chat = await model('Chat').findById(new Types.ObjectId(chatId));

	const chats = await model('Chat').find({ deleted: false });
	const messages = await model('Message').getMessages({ chatId: chat._id, searchString });

	res.render('pages/home', {
		title: 'Chat: ' + chat.name,
		serverURL,
		chats: chats,
		messages: messages
	});
};
