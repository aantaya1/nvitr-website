const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
//const helmet = require('helmet');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

//Connect to mongodb
mongoose.set('debug', true);
mongoose.connect('mongodb://admin:a12345@ds127843.mlab.com:27843/nviterdb_final' || 'mongodb://localhost/NviterDB', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

//Event listener for once mongoose actually connects to the db
mongoose.connection.once('open', function(){
    console.log('Successfully connected to the DB!');
}).on('error', function(error){
    console.log('Connection error: ', error);
});

require('./passport')(passport);

//stuff to make express app easier to use
app.use(morgan('dev'));//This will log all of our requests to the console
app.use(cookieParser());//This will allow us to make sessions to prevent someone from making a request for a page they shouldn't be on

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//make generating html easier with templates
app.set('view engine', 'ejs');

//stuff for passport
app.use(session({secret: 'alexa3project',
    saveUninitialized: true,
    resave: true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(__dirname + '/public'));

//Define express js routes
require('./server/routes.js')(app, passport);
require('./serverHelper.js')(app);

//Launch the app
app.listen(port, function(){
    console.log('Now listening for requests on port ', port);
});