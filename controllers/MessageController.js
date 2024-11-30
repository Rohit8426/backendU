import Message from '../models/message.js';

export const createMessage = async ({ senderId, groupId, content, messageType, attachments }) => {
  return await Message.create({ senderId, groupId, content, messageType, attachments });
};


export const markMessageAsRead = async (messageId) => {
  const message = await Message.findByPk(messageId);
  if (message) {
    message.isRead = true;
    await message.save();
  }
  return message;
};


export const getMessagesByGroup = async (groupId) => {
  return await Message.findAll({
    where: { groupId },
    order: [['createdAt', 'ASC']],
  });
};


export default { createMessage, markMessageAsRead, getMessagesByGroup };
