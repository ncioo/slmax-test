const { model } = require('mongoose');
const { eventTypes } = require('../utils');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	if (!session.user) return io.emit(eventTypes.ERROR, { message: 'Unauthorized' });

	const { name } = data;

	try {
		const result = await model('Chat').createChat(name, session.user);

		io.emit(eventTypes.CHAT_CREATED, {
			chat: result,
			user: session.user
		});
	} catch (error) {
		console.error(error);
		return io.emit(eventTypes.ERROR, { message: 'Error' });
	}
};
