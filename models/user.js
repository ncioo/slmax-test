const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//	Создаем схему пользователя
const userSchema = new Schema({
	//	Имя пользователя
	username: String,
	//	Уникальный емеил пользователя
	email: {
		type: String,
		unique: true
	},
	//	Флаг удаленности пользователя
	deleted: { type: Boolean, default: false },
	//	Дата создания
	createdAt: { type: Date, default: Date.now }
});

//	Добавляем плагин из passport-local-mongoose в схему пользователя
userSchema.plugin(passportLocalMongoose, { usernameQueryFields: ['username', 'email'] });

//	Создаем статичный метод создания пользователя
userSchema.statics.createAccount = async function (username, email, password) {
	const user = new this({
		username: username,
		email: email
	});

	//	Хешируем пароль и сохраняем нового пользователя в базу
	await this.register(user, password);

	//	Возвращаем нового пользователя
	return user;
};

//	Создаем модель со схемой
module.exports = model('User', userSchema);
