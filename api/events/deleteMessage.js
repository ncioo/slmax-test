const { model } = require('mongoose');
const { eventTypes } = require('../utils');
const { OperationError, UserNotAllowedError } = require('../errors');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	if (!session.user)
		return io.emit(eventTypes.ERROR, new UserNotAllowedError('Unauthorized').toJSON());

	const { messageId } = data;

	try {
		const result = await model('Message').deleteOrRestoreMessage(messageId, session.user);

		io.emit(eventTypes.MESSAGE_DELETED, {
			message: result
		});
	} catch (error) {
		if (error instanceof OperationError) {
			return io.emit(eventTypes.ERROR, error.toJSON());
		} else return io.emit(eventTypes.ERROR, { message: error });
	}
};
