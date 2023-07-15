const { Schema, model, Types } = require('mongoose');
const { UserNotAllowedError, NotFoundError } = require('../api/errors');

//	Создаем схему чата
const chatSchema = new Schema({
	name: String,
	//	ID создателя чата
	ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
	//	Массив ID участников чата
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	//	Флаг удаленности чата
	deleted: { type: Boolean, default: false },
	//	Дата создания
	createdAt: { type: Date, default: Date.now }
});

//	Создаем статичный метод создания чата
chatSchema.statics.createChat = async function (name, user) {
	const newChat = await this.create({
		name: name,
		ownerId: user._id,
		//	Пользователь, создавший чат является первым его участником
		members: [user._id]
	});

	//	Возвращаем новый чат
	return newChat;
};

//	Создаем статичный метод добавления участника в чат
chatSchema.statics.addMember = async function (chat, user) {
	//	Добавляем ID пользователя в массив
	chat.members.push(user._id);

	//	Сохраняем и возвращаем измененный чат
	return chat.save();
};

//	Создаем статичный метод удаления/восстановления чата
chatSchema.statics.deleteOrRestoreChat = async function (chatId, user) {
	//	Ищем чат по переданному ID
	const target = await model('Chat').findById(new Types.ObjectId(chatId));

	//	Если чат не найден - возвращаем ошибку
	if (!target) {
		throw new NotFoundError('There is no chat with this ID');
	}

	//	Если создатель чата - не пользователь, который хочет его удалить, возвращаем ошибку
	if (!target.ownerId.equals(user._id))
		throw new UserNotAllowedError('You cannot delete this chat');

	await model('Message').updateMany({ chatId: target._id }, { deleted: !target.deleted });

	//	Меняем флаг удаленности на противоположный
	target.deleted = !target.deleted;

	//	Сохраняем и возвращаем удаленный/восстановленный чат
	return target.save();
};

//	Создаем модель со схемой
module.exports = model('Chat', chatSchema);
