const { Schema, model, Types } = require('mongoose');

const chatSchema = new Schema({
	name: String,
	members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	deleted: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }
});

chatSchema.statics.createChat = async function (name, user) {
	const newChat = await this.create({
		name: name,
		members: [user._id]
	});

	return newChat;
};

chatSchema.statics.addMember = async function (chat, user) {
	chat.members.push(user._id);
	return chat.save();
};

chatSchema.statics.deleteOrRestoreChat = async function (chatId) {
	const target = await model('Chat').findById(new Types.ObjectId(chatId));

	await model('Message').updateMany({ chatId: target._id }, { deleted: !target.deleted });

	target.deleted = !target.deleted;
	return target.save();
};

module.exports = model('Chat', chatSchema);
