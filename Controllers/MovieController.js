const Movie = require('../models/Movie');

exports.createMovie = async (req, res) => {
    const { title, description, availableSeats, price } = req.body;

    try {
        const movie = await Movie.create({
            title,
            description,
            availableSeats,
            price,
            provider: req.user._id,
        });

        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ message: "Failed to create the movie" });
    }
};

exports.deleteMovie = async (req, res) => {
    const { id } = req.params;

    try {
        let movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        if (movie.provider.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this movie' });
        }
        await movie.remove();
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: "Error deleting movie" });
    }
};

exports.updateMovie = async (req, res) => {
    const { id } = req.params;
    const { title, description, availableSeats, price } = req.body;

    try {
        let movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        if (movie.provider.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this movie' });
        }

        movie.title = title || movie.title;
        movie.description = description || movie.description;
        movie.availableSeats = availableSeats || movie.availableSeats;
        movie.price = price || movie.price;

        await movie.save();
        res.json(movie);
    } catch (error) {
        res.status(400).json({ message: 'Error updating movie' });
    }
}

exports.bookMovie = async (req, res) => {
    const { id } = req.params;
    const { seats } = req.body;

    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie is not available, So couldn't book" });
        }
        if (movie.availableSeats < seats) {
            return res.status(400).json({ message: "Not enough seats available,So couldn't book" });
        }
        movie.availableSeats -= seats;
        await movie.save();
        return res.json({ message: "Booking Successful!" });
    } catch (error) {
        return res.status(400).json({ message: "Error while booking" });
    }
}

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Server error' });
    }
};