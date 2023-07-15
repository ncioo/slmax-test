const { model } = require('mongoose');
const { eventTypes } = require('../utils');
const { OperationError, UserNotAllowedError } = require('../errors');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	//	Проверяем наличие залогиненного пользователя в сессии
	if (!session.user)
		//	Если его нет - возвращаем ошибку UserNotAllowedError в JSON-формате
		return io.emit(eventTypes.ERROR, new UserNotAllowedError('Unauthorized').toJSON());

	//	ID сообщения из объекта data
	const { messageId } = data;

	try {
		//	Вызываем функцию удаления из модели Message
		//	и передаем ID сообщения и пользователя из сессии
		const result = await model('Message').deleteOrRestoreMessage(messageId, session.user);

		//	Вызываем событие на клиенте о том, что сообщение удалено
		io.emit(eventTypes.MESSAGE_DELETED, {
			message: result,
			user: session.user
		});
	} catch (error) {
		if (error instanceof OperationError) {
			//	Если ошибка является кастомной, возвращаем её в JSON-формате
			return io.emit(eventTypes.ERROR, error.toJSON());
		} else return io.emit(eventTypes.ERROR, { message: error });
	}
};
