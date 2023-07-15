const { eventTypes } = require('../utils');
const createChat = require('./createChat');
const createMessage = require('./createMessage');
const deleteChat = require('./deleteChat');
const deleteMessage = require('./deleteMessage');

module.exports = function (io) {
	io.on(eventTypes.CONNECTION, socket => {
		//	Имитируем событие сразу же при подключении и отправляем сессию с пользователем на клиент
		socket.emit(eventTypes.LOAD_SESSION, { user: socket.request?.session.user } || null);

		//	Слушаем событие о создании чата и вызываем соответствующий обработчик
		socket.on(eventTypes.CREATE_CHAT, data => createChat(io, socket, data));

		//	Слушаем событие о создании сообщения и вызываем соответствующий обработчик
		socket.on(eventTypes.CREATE_MESSAGE, data => createMessage(io, socket, data));

		//	Слушаем событие о удалении чата и вызываем соответствующий обработчик
		socket.on(eventTypes.DELETE_CHAT, data => deleteChat(io, socket, data));

		//	Слушаем событие о удалении сообщения и вызываем соответствующий обработчик
		socket.on(eventTypes.DELETE_MESSAGE, data => deleteMessage(io, socket, data));
	});
};
