const { model } = require('mongoose');
const { eventTypes } = require('../utils');
const { OperationError, UserNotAllowedError } = require('../errors');

module.exports = async function (io, socket, data) {
	const session = socket.request.session;

	//	Проверяем наличие залогиненного пользователя в сессии
	if (!session.user)
		//	Если его нет - возвращаем ошибку UserNotAllowedError в JSON-формате
		return io.emit(eventTypes.ERROR, new UserNotAllowedError('Unauthorized').toJSON());

	//	Название чата из объекта data
	const { name } = data;

	try {
		//	Вызываем функцию создания из модели Chat
		//	и передаем название чата и пользователя из сессии
		const result = await model('Chat').createChat(name, session.user);

		//	Вызываем событие на клиенте о том, что создан новый чат
		io.emit(eventTypes.CHAT_CREATED, {
			chat: result,
			user: session.user
		});
	} catch (error) {
		if (error instanceof OperationError) {
			//	Если ошибка является кастомной, возвращаем её в JSON-формате
			return io.emit(eventTypes.ERROR, error.toJSON());
		} else return io.emit(eventTypes.ERROR, { message: error });
	}
};
