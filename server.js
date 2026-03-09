// MODULES //

// Env access
require('dotenv').config();

// Common Core modules
const path = require('path');
const cors = require('cors');

// NPM Modules
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');


// MIDDLEWARE //

const { logger } = require(path.join(__dirname,'middleware','logEvents'));
const errorHandler = require(path.join(__dirname,'middleware','errorHandler'));
const verifyJWT = require(path.join(__dirname,'middleware','verifyJWT'));
const credentials = require(path.join(__dirname,'middleware','credentials'))


// SETUP //

// Mongo setup
const connectDB = require(path.join(__dirname,'config','dbConn'));

// Cors Setup
const corsOptions = require(path.join(__dirname,'config','corsOptions'));

// Initialize app
const app = express();

// Port setup
const PORT = process.env.PORT || 3500;


// CONNECT TO MONGODB
connectDB();


// HANDLERS //

// Log Handling
app.use(logger);

// Credentials Handling
app.use(credentials);

// Cross Origin Resource Sharing Handling
app.use(cors(corsOptions));

// URL-encoded Form Data Handling
app.use(express.urlencoded({ extended: false }));

// JSON Handling
app.use(express.json());

// Cookies
app.use(cookieParser());

// Static File Handling
app.use('/', express.static(path.join(__dirname, '/public')));


// ROUTES //

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.all(/.*/, (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


// ERROR HANDLING //

app.use(errorHandler);


// START APP //

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});