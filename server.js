const express       = require('express');
const dotenv        = require('dotenv');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const cors          = require('cors');
const morgan        = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./Middleware/error');

// Load ENV vars
dotenv.config({ path: './.env'});
// Initialise the app
const connectDB = require('./Config/db');

// Connect to database
connectDB();
const app = express();

// Import routes files
const auth = require("./Route/auth");
const users = require("./Route/user");
const identity = require("./Route/identity");
const account = require("./Route/account");

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Cookie parser
app.use(cookieParser());
app.use(cors());

var port = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('Hello from SafeBank API'));

// Development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount API routes in the App
app.use('/auth', auth);
app.use('/users', users);
app.use('/identity', identity);
app.use('/account', account);
app.use(errorHandler);
// Launch app to listen to specified port
app.listen(port, function () {
    console.log(`Running SafeBank in ${process.env.NODE_ENV} mode on port ` + port);
});