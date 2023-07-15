const { model } = require('mongoose');
const { eventTypes } = require('../utils');
const { OperationError, UserNotAllowedError } = require('../errors');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	if (!session.user)
		return io.emit(eventTypes.ERROR, new UserNotAllowedError('Unauthorized').toJSON());

	const { chatId } = data;

	try {
		const result = await model('Chat').deleteOrRestoreChat(chatId, session.user);

		io.emit(eventTypes.CHAT_DELETED, {
			chat: result
		});
	} catch (error) {
		if (error instanceof OperationError) {
			return io.emit(eventTypes.ERROR, error.toJSON());
		} else return io.emit(eventTypes.ERROR, { message: error });
	}
};
