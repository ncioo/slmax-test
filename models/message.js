const { Schema, model, Types } = require('mongoose');
const { uploadFile } = require('../api/utils');
const { UserNotAllowedError, NotFoundError } = require('../api/errors');

const messageSchema = new Schema({
	authorId: { type: Schema.Types.ObjectId, ref: 'User' },
	chatId: { type: Schema.Types.ObjectId, ref: 'Chat' },
	content: String,
	attachment: { type: String, default: null },
	deleted: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }
});

messageSchema.statics.getMessages = async function (filter = {}) {
	let findOrder = {};

	if (filter?.chatId) findOrder.chatId = filter?.chatId;
	if (filter?.searchString)
		findOrder.content = { $regex: `${filter?.searchString}`, $options: 'i' };
	if (!filter?.showDeleted) findOrder.deleted = false;

	const result = await model('Message').aggregate([
		{ $match: findOrder },
		{ $lookup: { from: 'users', localField: 'authorId', foreignField: '_id', as: 'author' } },
		{ $set: { author: { $first: '$author' } } }
	]);

	return result;
};

messageSchema.statics.createMessage = async function (chatId, user, content, file) {
	const chat = await model('Chat').findById(new Types.ObjectId(chatId));

	if (!chat) {
		throw new NotFoundError('There is no chat with this ID');
	}

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

messageSchema.statics.deleteOrRestoreMessage = async function (messageId, user) {
	const target = await model('Message').findById(new Types.ObjectId(messageId));

	if (!target) {
		throw new NotFoundError('There is no message with this ID');
	}

	if (!target.authorId.equals(user._id))
		throw new UserNotAllowedError('You cannot delete this message');

	target.deleted = !target.deleted;
	return target.save();
};

module.exports = model('Message', messageSchema);
