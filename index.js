const express = require('express');
const mongoose = require('mongoose');
// const redis = require('redis');
const dotenv = require('dotenv');
const connectDB = require('./config/mongo');
const movieRoutes = require('./Routes/movieRoutes');
const authRoutes = require('./Routes/authRoutes');
const cors = require('cors');

const app = express();

dotenv.config();

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth',authRoutes);
app.use('/api/movies',movieRoutes);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server running on Port:${port}`);
});
