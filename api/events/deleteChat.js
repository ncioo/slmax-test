const { model } = require('mongoose');
const { eventTypes } = require('../utils');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	if (!session.user) return io.emit(eventTypes.ERROR, { message: 'Unauthorized' });

	const { chatId } = data;

	try {
		const result = await model('Chat').deleteOrRestoreChat(chatId);

		io.emit(eventTypes.CHAT_DELETED, {
			chat: result
		});
	} catch (error) {
		console.error(error);
		return io.emit(eventTypes.ERROR, { message: 'Error' });
	}
};
