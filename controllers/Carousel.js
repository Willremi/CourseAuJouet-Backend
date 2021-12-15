const Carousel = require('../models/carousel')

exports.getCarousel = (req, res, next) => {
    Carousel.find()
        .then(carousel => res.status(200).json(carousel))
        .catch(error => res.status(400).json({error}));
}

exports.addOneSlideInCarousel = (req, res, next) => {
    const slide = new Carousel({
        title: req.body.title,
        image: req.body.image,
        link: req.body.link,
    })

    slide.save()
        .then(carousel => res.status(201).json(carousel))
        .catch(error => res.status(500).json({error}))
}

exports.deleteOneSlideInCarousel = (req, res, next) => {

}