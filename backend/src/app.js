const errorHandler = require('./middlewares/errorHandlerMiddleware');
const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.get('/', (req, res) => {
   res.send('FleetTrack API is running ...');
});

// Middleware de gestion des erreurs
app.use(errorHandler);

module.exports = app;