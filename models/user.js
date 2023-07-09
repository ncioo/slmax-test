const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
	username: String,
	email: {
		type: String,
		unique: true
	},
	deleted: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }
});

userSchema.plugin(passportLocalMongoose, { usernameQueryFields: ['username', 'email'] });

userSchema.statics.createAccount = async function (username, email, password) {
	const user = new this({
		username: username,
		email: email
	});
	await this.register(user, password);

	return user;
};

module.exports = model('User', userSchema);
