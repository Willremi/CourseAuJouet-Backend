const express = require('express');
const router = express.Router();
const searchCtrl = require('../controllers/search');

router.post('/getsearchproduct', searchCtrl.searchProduct);
module.exports = router;