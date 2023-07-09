const { model } = require('mongoose');
const { eventTypes } = require('../utils');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	if (!session.user) return io.emit(eventTypes.ERROR, { message: 'Unauthorized' });

	const { chatId, content, file } = data;

	try {
		const result = await model('Message').createMessage(chatId, session.user, content, file);

		io.emit(eventTypes.MESSAGE_CREATED, {
			user: session.user,
			content: result.content,
			attachment: result.fileURL
		});
	} catch (error) {
		console.error(error);
		return io.emit(eventTypes.ERROR, { message: 'Error' });
	}
};
