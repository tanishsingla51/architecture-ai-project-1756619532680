const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiV1Routes = require('./api/v1/routes/index.routes');
const { errorHandler } = require('./api/v1/middlewares/errorHandler.middleware');

const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure your app by setting various HTTP headers
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// API Routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Food Ordering API',
        version: '1.0.0',
    });
});

app.use('/api/v1', apiV1Routes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;