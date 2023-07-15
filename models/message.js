const { Schema, model, Types } = require('mongoose');
const { uploadFile } = require('../api/utils');
const { UserNotAllowedError, NotFoundError } = require('../api/errors');

//	Создаем схему сообщения
const messageSchema = new Schema({
	//	ID автора сообщения
	authorId: { type: Schema.Types.ObjectId, ref: 'User' },
	//	ID чата, к которому относится сообщение
	chatId: { type: Schema.Types.ObjectId, ref: 'Chat' },
	//	Контент сообщения
	content: String,
	//	Публичная ссылка на файл
	attachment: { type: String, default: null },
	//	Флаг удаленности сообщения
	deleted: { type: Boolean, default: false },
	//	Дата создания
	createdAt: { type: Date, default: Date.now }
});

//	Создаем статичный метод получения сообщений по заданным параметрам
messageSchema.statics.getMessages = async function (filter = {}) {
	let findOrder = {};

	if (filter?.chatId)
		//	Если передан ID чата, то добавляем его в объект поиска
		findOrder.chatId = filter?.chatId;
	if (filter?.searchString)
		//	Если передана строка поиска, то добавляем её в объект поиска
		//	Ищем совпадения с игнорированием регистра и в любой части контента
		findOrder.content = { $regex: `${filter?.searchString}`, $options: 'i' };
	if (!filter?.showDeleted)
		//	Если не передан флаг удаленности, то по-умолчанию отображаем только НЕ удаленные сообщения
		findOrder.deleted = false;

	const result = await model('Message').aggregate([
		//	Получаем массив совпадений
		{ $match: findOrder },
		//	Добавляем в каждый объект сообщения поле author с объектом автора сообщения
		{ $lookup: { from: 'users', localField: 'authorId', foreignField: '_id', as: 'author' } },
		//	Преобразуем результат $lookup'а:
		//	из массива с одним элементом
		//	{
		//		author: [ { _id: ... } ]
		//	}
		//	в объект
		//	{
		//		author: { _id: ... }
		//	}
		{ $set: { author: { $first: '$author' } } }
	]);

	return result;
};

//	Создаем статичный метод создания сообщения
messageSchema.statics.createMessage = async function (chatId, user, content, file) {
	//	Ищем чат по переданному ID
	const chat = await model('Chat').findById(new Types.ObjectId(chatId));

	//	Если чат не найден - возвращаем ошибку
	if (!chat) {
		throw new NotFoundError('There is no chat with this ID');
	}

	let attachment = null;

	//	Если пользователь пишет в чат первый раз - увеличиваем
	//	количество участников чата добавляя ID пользователя в members
	if (!chat.members.includes(user._id)) await model('Chat').addMember(chat, user);

	//	Если передан файл - загружаем его через функцию uploadFile
	if (file) {
		//	Функция возвращает публичный URL файла
		attachment = await uploadFile(file, user.username);
	}

	const newMessage = await this.create({
		authorId: user._id,
		chatId: chat._id,
		content: content,
		attachment: attachment
	});

	//	Возвращаем новое сообщение
	return newMessage;
};

//	Создаем статичный метод удаления/восстановления сообщения
messageSchema.statics.deleteOrRestoreMessage = async function (messageId, user) {
	//	Ищем сообщение по переданному ID
	const target = await model('Message').findById(new Types.ObjectId(messageId));

	//	Если сообщение не найдено - возвращаем ошибку
	if (!target) {
		throw new NotFoundError('There is no message with this ID');
	}

	//	Если автор сообщения - не пользователь, который хочет его удалить, возвращаем ошибку
	if (!target.authorId.equals(user._id))
		throw new UserNotAllowedError('You cannot delete this message');

	//	Меняем флаг удаленности на противоположный
	target.deleted = !target.deleted;

	//	Сохраняем и возвращаем удаленное/восстановленное сообщение
	return target.save();
};

//	Создаем модель со схемой
module.exports = model('Message', messageSchema);
