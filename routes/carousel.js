const express = require('express');
const router = express.Router();
const carouselctrl = require('../controllers/Carousel');

router.get('/getcarousel', carouselctrl.getCarousel);
router.post('/addcarousel', carouselctrl.addOneSlideInCarousel);
router.delete('/deletecarousel', carouselctrl.deleteOneSlideInCarousel);

module.exports = router;