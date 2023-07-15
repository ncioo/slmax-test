const { model } = require('mongoose');
const { serverURL } = require('../../config');

module.exports = async function (req, res) {
	//	Получаем все НЕ удаленные чаты
	const chats = await model('Chat').find({ deleted: false });

	//	Рендерим HTML-страницу со списком всех НЕ удаленных чатов
	res.render('pages/home', {
		//	Заголовок страницы
		title: 'Home',
		//	Статичная ссылка севрера. Нужна для правильной
		//	подгрузки файлов из /public
		serverURL,
		//	Массив всех существующих чатов
		chats: chats,
		//	Пустой массив сообщений, т.к. чат еще не выбран
		messages: []
	});
};
