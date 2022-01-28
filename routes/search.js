const express = require('express');
const router = express.Router();
const searchCtrl = require('../controllers/search');

router.post('/getsearchproduct', searchCtrl.searchProduct);
router.post('/getonSelectedAutoCompletion', searchCtrl.onSelectedAutoCompletion)
router.get('/autocompletesearch/:text', searchCtrl.autoCompleteSearch)
module.exports = router;
