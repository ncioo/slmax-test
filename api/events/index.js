const { eventTypes } = require('../utils');
const createChat = require('./createChat');
const createMessage = require('./createMessage');
const deleteChat = require('./deleteChat');
const deleteMessage = require('./deleteMessage');

module.exports = function (io) {
	io.on(eventTypes.CONNECTION, socket => {
		socket.emit(eventTypes.LOAD_SESSION, { user: socket.request?.session.user } || null);

		socket.on(eventTypes.CREATE_CHAT, data => createChat(io, socket, data));

		socket.on(eventTypes.CREATE_MESSAGE, data => createMessage(io, socket, data));

		socket.on(eventTypes.DELETE_CHAT, data => deleteChat(io, socket, data));

		socket.on(eventTypes.DELETE_MESSAGE, data => deleteMessage(io, socket, data));
	});
};
