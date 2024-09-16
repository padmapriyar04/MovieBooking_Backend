const express = require('express');
const {createMovie,deleteMovie,updateMovie,bookMovie,getAllMovies,getMoviesByProvider} = require('../Controllers/MovieController');
const {protect,authorize} = require('../middleware/Auth');

const router = express.Router();

router.post('/',protect,authorize('Provider','Admin'),createMovie);
router.put('/:id',protect,authorize('Provider','Admin'),updateMovie);
router.delete('/:id',protect,authorize('Provider','Admin'),deleteMovie);
router.put('/book/:id',protect,authorize('User','Admin','Provider'),bookMovie);
router.get('/',protect,authorize('Provider','Admin'),getAllMovies);
router.get('/provider/:providerId', protect, authorize('Provider', 'Admin'), getMoviesByProvider);

module.exports = router;
