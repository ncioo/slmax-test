const { model } = require('mongoose');
const { eventTypes } = require('../utils');
const { OperationError, UserNotAllowedError } = require('../errors');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	if (!session.user)
		return io.emit(eventTypes.ERROR, new UserNotAllowedError('Unauthorized').toJSON());

	const { name } = data;

	try {
		const result = await model('Chat').createChat(name, session.user);

		io.emit(eventTypes.CHAT_CREATED, {
			chat: result,
			user: session.user
		});
	} catch (error) {
		if (error instanceof OperationError) {
			return io.emit(eventTypes.ERROR, error.toJSON());
		} else return io.emit(eventTypes.ERROR, { message: error });
	}
};
