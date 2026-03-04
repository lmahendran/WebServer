const whitelist = [
    'https://www.yourhostdomain.com',
    'http://127.0.0.1:5500', 
    'http://localhost:3500'
]; // list of allowed origins - only requests from these origins will be accepted by the server
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 - set the status code to 200 for successful OPTIONS requests
}

module.exports = corsOptions;