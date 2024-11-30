import express from 'express';
import MessageController from '../controllers/MessageController.js';

const router = express.Router();
router.post('/', async (req, res) => {
  try {
    const message = await MessageController.createMessage(req.body);
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ success: false, error: 'Failed to create message' });
  }
});

router.get('/:groupId', async (req, res) => {
  try {
    const messages = await MessageController.getMessagesByGroup(req.params.groupId);
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

export default router;
