//Note: This file must be in the 'test' directory in order for the mocha test suite to run successfully
    //Mocha will run all of the file in the 'test' directory and if this file is not there, then the test will
    //throw an error.

const mongoose = require('mongoose');

//Connect to mongodb
before(function (done) {
    mongoose.set('debug', true);
    mongoose.connect('mongodb://localhost/NviterDB');

    //Event listener for once mongoose actually connects to the db
    mongoose.connection.once('open', function(){
        console.log('Connection successful!');
        done();
    }).on('error', function(error){
        console.log('Connection error: ', error);
    });
});