const events = {
	CONNECT: 'connect',
	DISCONNECT: 'disconnect',
	ERROR: 'error',
	LOAD_SESSION: 'loadSession',
	CREATE_CHAT: 'createChat',
	NEW_CHAT: 'newChat',
	CREATE_MESSAGE: 'createMessage',
	DELETE_CHAT: 'deleteChat',
	CHAT_DELETED: 'chatDeleted',
	NEW_MESSAGE: 'newMesasge',
	DELETE_MESSAGE: 'deleteMessage',
	MESSAGE_DELETED: 'messageDeleted'
};

var socket = io();

var userData = document.getElementById('user-data');
var messages = document.getElementById('chat-messages');

socket.on(events.ERROR, function (error) {
	alert(error.message);
});

socket.on(events.LOAD_SESSION, function (data) {
	const { user } = data;
	userData.textContent = user ? `Logged as ${user.username}` : 'Unauthorized';
});

var messageForm = document.getElementById('message-form');
messageForm.addEventListener('submit', function (e) {
	e.preventDefault();

	var messageContentInput = document.getElementById('message-content');
	var messageFileInput = document.getElementById('message-file');

	chatId = location.href.split('/').pop();
	if (chatId == '/' || chatId.length < 24) return alert('Select chat');
	if (messageContentInput.value) {
		socket.emit(events.CREATE_MESSAGE, {
			chatId: chatId,
			content: messageContentInput.value,
			file: messageFileInput.files[0]
		});
		messageContentInput.value = '';
	}
});

socket.on(events.NEW_MESSAGE, function (data) {
	const { user, content } = data;

	window.location.reload();
});

var createChatForm = document.getElementById('create-chat-form');
createChatForm.addEventListener('submit', function (e) {
	e.preventDefault();

	var chatNameInput = document.getElementById('create-chat-name');

	if (chatNameInput.value) {
		socket.emit(events.CREATE_CHAT, {
			name: chatNameInput.value
		});
	}
});

socket.on(events.NEW_CHAT, function (data) {
	const { chat } = data;

	alert(`Chat ${chat.name} created!`);
	window.location.reload();
});

function deleteChat(chatId) {
	socket.emit(events.DELETE_CHAT, { chatId: chatId });
}

socket.on(events.CHAT_DELETED, function (data) {
	const { chat } = data;

	alert(`Chat ${chat.name} deleted!`);
	window.location.reload();
});

function deleteMessage(messageId) {
	socket.emit(events.DELETE_MESSAGE, { messageId: messageId });
}

socket.on(events.MESSAGE_DELETED, function (data) {
	const { message } = data;

	alert(`Message ${message._id} deleted!`);
	window.location.reload();
});

var loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	var emailInput = document.getElementById('login-email');
	var passwordInput = document.getElementById('login-password');

	const response = await fetch('http://localhost:8080/login', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache'
		},

		body: JSON.stringify({
			email: emailInput.value,
			password: passwordInput.value
		})
	});

	const result = await response.json();

	userData.textContent = `Logged as ${result.user.username}`;
	window.location.reload();
});

var registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	var usernameInput = document.getElementById('register-username');
	var emailInput = document.getElementById('register-email');
	var passwordInput = document.getElementById('register-password');

	const response = await fetch('http://localhost:8080/register', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache'
		},

		body: JSON.stringify({
			username: usernameInput.value,
			email: emailInput.value,
			password: passwordInput.value
		})
	});

	const result = await response.json();
	userData.textContent = `Logged as ${result.user.username}`;
	window.location.reload();
});

var logoutForm = document.getElementById('logout-form');
logoutForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	const response = await fetch('http://localhost:8080/logout', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache'
		}
	});

	const result = await response.json();
	userData.textContent = 'Unauthorized';
	window.location.reload();
});
