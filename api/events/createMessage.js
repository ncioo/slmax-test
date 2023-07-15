const { model } = require('mongoose');
const { eventTypes } = require('../utils');
const { OperationError, UserNotAllowedError } = require('../errors');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	if (!session.user)
		return io.emit(eventTypes.ERROR, new UserNotAllowedError('Unauthorized').toJSON());

	const { chatId, content, file } = data;

	try {
		const result = await model('Message').createMessage(chatId, session.user, content, file);

		io.emit(eventTypes.MESSAGE_CREATED, {
			user: session.user,
			content: result.content,
			attachment: result.fileURL
		});
	} catch (error) {
		if (error instanceof OperationError) {
			return io.emit(eventTypes.ERROR, error.toJSON());
		} else return io.emit(eventTypes.ERROR, { message: error });
	}
};
