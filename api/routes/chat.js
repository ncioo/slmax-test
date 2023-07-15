const { model, Types } = require('mongoose');
const { serverURL } = require('../../config');

module.exports = async function (req, res) {
	//	Получаем данные из ссылки
	const chatId = req.params.id,
		searchString = req.query?.searchString;

	//	Получаем все НЕ удаленные чаты
	const chats = await model('Chat').find({ deleted: false });

	//	Получаем конкретный чат по ID из ссылки
	//	PS: В рамках тестового задания считаем
	//	что у нас ВСЕГДА передается верный ID
	const chat = await model('Chat').findById(new Types.ObjectId(chatId));

	//	Получаем все сообщения конкретного чата через функцию получения из модели Message
	const messages = await model('Message').getMessages({ chatId: chat._id, searchString });

	//	Рендерим HTML-страницу с сообщениями конкретного чата
	res.render('pages/home', {
		//	Заголовок страницы
		title: 'Chat: ' + chat.name,
		//	Статичная ссылка сервера. Нужна для правильной подгрузки файлов из /public
		serverURL,
		//	Массив всех существующих чатов
		chats: chats,
		//	Массив сообщений выбранного чата
		messages: messages
	});
};
