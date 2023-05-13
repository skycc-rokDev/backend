const express = require('express');
const router = express.Router();
const relationController = require('../controllers/relationController');

router.post('/add', relationController.addRelation);

module.exports = router;
