const { model } = require('mongoose');
const { eventTypes } = require('../utils');
const { OperationError, UserNotAllowedError } = require('../errors');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	//	Проверяем наличие залогиненного пользователя в сессии
	if (!session.user)
		//	Если его нет - возвращаем ошибку UserNotAllowedError в JSON-формате
		return io.emit(eventTypes.ERROR, new UserNotAllowedError('Unauthorized').toJSON());

	//	ID чата, контент сообщения и буфер файла из объекта data
	const { chatId, content, file } = data;

	try {
		//	Вызываем функцию создания из модели Message и передаем
		//	ID чата, пользователя из сессии, контент сообщения и буфер файла
		const result = await model('Message').createMessage(chatId, session.user, content, file);

		//	Вызываем событие на клиенте о том, что создано новое сообщение
		io.emit(eventTypes.MESSAGE_CREATED, {
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
