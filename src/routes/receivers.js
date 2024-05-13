const express = require('express');
const router = express.Router();
const receiverController = require('../controllers/receiverController');

router.post('/', receiverController.createReceiver);
router.get('/', receiverController.listReceivers);
router.put('/:id', receiverController.updateReceiver);
router.delete('/', receiverController.deleteReceivers);

module.exports = router;
