const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.post('/add', cardController.addCard);
router.get('/list', cardController.listCard);
router.get('/mycard', cardController.MyCard);
router.delete('/delete', cardController.deleteCard);

module.exports = router;
