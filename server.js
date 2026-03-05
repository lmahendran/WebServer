const express = require('express');
const app = express();  // typical naming convention for the express application
// common core modules - built in modules that come with node
const path = require('path');
const cors = require('cors'); // cross origin resource sharing - allows the server to accept requests from different origins (domains) - for example, if the client is hosted on a different domain than the server, the server will reject the request unless CORS is enabled
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents'); // import the logger middleware function from the logEvents module
const errorHandler = require('./middleware/errorHandler'); // import the errorHandler middleware function from the errorHandler module
const { error } = require('console');
const PORT = process.env.PORT || 3500;  // local port - the port that the server will listen on

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
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

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));