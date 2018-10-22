const assert = require('assert');
const User = require('../server/models/users');

describe('testing users db', function(){

    //Testing adding a user to the db
    it('Saves a user to the database', function(done){
        var new_user = new User({
            username: 'john_smith'
        });
        new_user.password = new_user.generateHash('abc123');

        new_user.save().then(function(){
            assert(new_user.isNew === false);
            done();
        });
    });
});