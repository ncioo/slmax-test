const { Schema, model, Types } = require('mongoose');
const { uploadFile } = require('../api/utils');

const messageSchema = new Schema({
	authorId: { type: Schema.Types.ObjectId, ref: 'User' },
	chatId: { type: Schema.Types.ObjectId, ref: 'Chat' },
	content: String,
	attachment: { type: String, default: null },
	deleted: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }
});

messageSchema.statics.getMessages = async function (chatId) {
	const result = await model('Message').aggregate([
		{ $match: { chatId: chatId, deleted: false } },
		{ $lookup: { from: 'users', localField: 'authorId', foreignField: '_id', as: 'author' } },
		{ $set: { author: { $first: '$author' } } }
	]);

	return result;
};

messageSchema.statics.createMessage = async function (chatId, user, content, file) {
	const chat = await model('Chat').findById(new Types.ObjectId(chatId));
	let attachment = null;

	if (!chat.members.includes(user._id)) await model('Chat').addMember(chat, user);

	if (file) {
		attachment = await uploadFile(file, user.username);
	}

	const newMessage = await this.create({
		authorId: user._id,
		chatId: chat._id,
		content: content,
		attachment: attachment
	});

	return newMessage;
};

messageSchema.statics.deleteOrRestoreMessage = async function (messageId) {
	const target = await model('Message').findById(new Types.ObjectId(messageId));

	target.deleted = !target.deleted;
	return target.save();
};

module.exports = model('Message', messageSchema);
