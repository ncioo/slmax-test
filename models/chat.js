const { Schema, model, Types } = require('mongoose');
const { UserNotAllowedError, NotFoundError } = require('../api/errors');

const chatSchema = new Schema({
	name: String,
	ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	deleted: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }
});

chatSchema.statics.createChat = async function (name, user) {
	const newChat = await this.create({
		name: name,
		ownerId: user._id,
		members: [user._id]
	});

	return newChat;
};

chatSchema.statics.addMember = async function (chat, user) {
	chat.members.push(user._id);
	return chat.save();
};

chatSchema.statics.deleteOrRestoreChat = async function (chatId, user) {
	const target = await model('Chat').findById(new Types.ObjectId(chatId));

	if (!target) {
		throw new NotFoundError('There is no chat with this ID');
	}
	if (!target.ownerId.equals(user._id))
		throw new UserNotAllowedError('You cannot delete this chat');

	await model('Message').updateMany({ chatId: target._id }, { deleted: !target.deleted });

	target.deleted = !target.deleted;
	return target.save();
};

module.exports = model('Chat', chatSchema);
