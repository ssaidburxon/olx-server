const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const messageCtrl = require('../controller/messageCtrl');


router.post('/', authMiddleware, messageCtrl.addMessage);
router.get('/:chatId', authMiddleware, messageCtrl.getMessage);
router.delete('/:messageId', authMiddleware, messageCtrl.deleteMessage);
router.put('/:messageId', authMiddleware, messageCtrl.updateMessage);

module.exports = router