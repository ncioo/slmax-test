const { model } = require('mongoose');
const { eventTypes } = require('../utils');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	if (!session.user) return io.emit(eventTypes.ERROR, { message: 'Unauthorized' });

	const { messageId } = data;

	try {
		const result = await model('Message').deleteOrRestoreMessage(messageId);

		io.emit(eventTypes.MESSAGE_DELETED, {
			message: result
		});
	} catch (error) {
		console.error(error);
		return io.emit(eventTypes.ERROR, { message: 'Error' });
	}
};
