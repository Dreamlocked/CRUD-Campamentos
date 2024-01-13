const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.get('/', catchAsync(campgrounds.index));

router.get('/new', campgrounds.renderNewForm);

router.post('/', upload.array('image'), catchAsync(campgrounds.createCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', catchAsync(campgrounds.renderEditForm));

router.put('/:id', upload.array('image'), catchAsync(campgrounds.updateCampground));

router.delete('/:id', catchAsync(campgrounds.deleteCampground));

module.exports = router;