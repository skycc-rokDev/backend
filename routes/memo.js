const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');

router.post('/add', memoController.addMemo);
router.get('/get', memoController.getMemo);

module.exports = router;
