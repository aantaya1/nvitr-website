let LocalStrategy = require('passport-local').Strategy;
let User = require('./server/models/users');

module.exports = function(passport){
    //serialize and deserialize will allow a user to remain logged in until they logout
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done){
        process.nextTick(function(){
            User.findOne({'username' : username}, function (err, user) {
                if(err) return done(err);

                if(user){//if the username already exits, then return
                    return done(null, false, req.flash('signupMessage', 'That username has already been taken'));
                }
                else{//At this point, the username has not been taken already...lets add it to db
                    let newUser = new User();

                    console.log('username: ' + username + ', password: ' + password + ', firstName: ' +
                        req.body.firstName + ', lastName: ' + req.body.lastName + ', age: ' + req.body.age +
                        ', gender: ' + req.body.gender);

                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.firstName = req.body.firstName;
                    newUser.lastName = req.body.lastName;
                    newUser.age = req.body.age;
                    newUser.gender = req.body.gender;

                    newUser.save(function (err) {
                        if(err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done){
            process.nextTick(function(){
                User.findOne({'username' : username}, function (err, user) {
                    if(err) return done(err);

                    if(!user){//Could not find the user in the db
                        return done(null, false, req.flash('loginMessage', 'No user found'));
                    }

                    if(!user.validPassword(password)){//Could not find the user in the db
                        return done(null, false, req.flash('loginMessage', 'Username and password did not match!'));
                    }

                    return done(null, user);
                });
            });
        }));
};