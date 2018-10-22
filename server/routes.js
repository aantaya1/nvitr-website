let Event = require('./models/events');
let EventManager = require('./models/eventManager');
let Attendee = require('./models/attendees');
const mongoose = require('mongoose');
let path = require('path');

module.exports = function (app, passport) {

    // Loads the landing page for the app
    app.get('/', function (req, res) {
        res.redirect('/login');
    });

    app.get('/login', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')} );
    });

    //Process login form
    app.post('/login', passport.authenticate('local-login',{
        successRedirect : '/home',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {message: req.flash('signupMessage')} );
    });

    //There are two possibilities, either the user signs up with a [unique] username and they get successfully redirected
    //  to a new profile page, or they try to register with a username that exists. If so, redirect to signup and let them
    //  know why they were redirected (via a flash to screen).
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/home',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    //Only users who are logged in can access this... so we use the isLoggedIn function below
    app.get('/profile', isLoggedIn, function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            res.render('profile.ejs', {
                user: req.user
            });
        }
    });

    //Only users who are logged in can access this... so we use the isLoggedIn function below
    app.get('/home', isLoggedIn, function (req, res) {
        if (!req.isAuthenticated()) res.redirect('/');
        else if (typeof req.user._id !== 'undefined'){
            console.log('HERE IS THE TEST OF ALL ---------> ' + req.user._id);
            let id = mongoose.Types.ObjectId('' + req.user._id + '');
            console.log('Rendering home of user: ' + id);

            Attendee.find({userID : id}, 'eventID', function (err, eventsA) {
                if(err) throw err;
                let numEvents = 0;
                let currEvent = 0;
                let allEvents = [];
                let eventIDs = [];
                console.log('Inside of attendee');
                eventsA.forEach(function(doc){
                    if(doc.eventID === null) return;
                    eventIDs[numEvents++] = doc.eventID;
                    console.log('Found event: ' + doc.eventID);
                });

                EventManager.find({userID: id}, 'eventID', function (err, eventsB) {
                    if(err) throw err;
                    console.log('Inside of EventManager');
                    eventsB.forEach(function(doc){
                        if(doc.eventID === null) return;
                        eventIDs[numEvents++] = doc.eventID;
                        console.log('Found Event: ' + doc.eventID);
                    });

                    for(let i=0; i<eventIDs.length; i++){
                        let eventid = mongoose.Types.ObjectId('' + eventIDs[i] + '');
                        console.log('Looking for event: ' + eventid);

                        Event.findById(eventid, function (err, event) {
                            if (err) throw err;
                            if (event.completed === false) {
                                allEvents[currEvent++] = {
                                    _id: eventid,
                                    title: event.title,
                                    address: event.address,
                                    city: event.city,
                                    state: event.state,
                                    time: event.time,
                                    duration: event.duration,
                                    capacity: event.capacity,
                                    minAge: event.minAge,
                                    description: event.description
                                };

                                console.log('FOUND: title: ' + event.title + ', description: ' + event.description);
                                if (i === eventIDs.length - 1) {//Only do this once all of the events are in the array
                                    console.log('Rendering home');
                                    res.render('home.ejs', {
                                        user: req.user,
                                        events: allEvents,
                                        eventMessage: req.flash('successfullyCreatedEvent')
                                    });
                                }
                            }
                        });
                    }
                    if(eventIDs.length===0){
                        res.render('home.ejs', {
                            user: req.user,
                            events: allEvents,
                            eventMessage: req.flash('successfullyCreatedEvent')
                        });
                    }
                });
            });
        }
    });

    //Only users who are logged in can access this... so we use the isLoggedIn function below
    app.get('/createEvent', isLoggedIn, function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            res.render('createEvent.ejs', {
                user: req.user
            });
        }
    });

    app.get('/previousEvents', isLoggedIn, function (req, res) {
        if (!req.isAuthenticated()) res.redirect('/');
        else if (typeof req.user._id !== 'undefined') {
            let id = mongoose.Types.ObjectId('' + req.user._id + '');
            console.log('Rendering previousEvents of user: ' + id);

            Attendee.find({userID: id}, 'eventID', function (err, prevEventsA) {
                if (err) throw err;
                let numEvents = 0;
                let currEvent = 0;
                let prevEvents = [];
                let eventIDs = [];
                console.log('Inside of attendee');

                prevEventsA.forEach(function (ele) {
                    if (ele.eventID === null) return;
                    if (ele.completed === true) {
                        eventIDs[numEvents++] = ele.eventID;
                        console.log('Found previous event: ' + ele.eventID);
                    }
                });

                EventManager.find({userID: id}, 'eventID', function (err, prevEventsB) {
                    if (err) throw err;
                    console.log('Inside of EventManager');
                    prevEventsB.forEach(function (doc) {
                        if (doc.eventID === null) return;
                        eventIDs[numEvents++] = doc.eventID;
                        console.log('Found Previous Event: ' + doc.eventID);
                    });

                    for (let i = 0; i < eventIDs.length; i++) {
                        let eventid = mongoose.Types.ObjectId('' + eventIDs[i] + '');
                        console.log('Looking for event: ' + eventid);

                        Event.findById(eventid, function (err, event) {
                            if (err) throw err;
                            if (event.completed !== false) {
                                prevEvents[currEvent++] = {
                                    _id: eventid,
                                    title: event.title,
                                    address: event.address,
                                    city: event.city,
                                    state: event.state,
                                    time: event.time,
                                    duration: event.duration,
                                    capacity: event.capacity,
                                    minAge: event.minAge,
                                    description: event.description
                                };
                                console.log('FOUND: title: ' + event.title + ', description: ' + event.description);
                            }
                            if (i === eventIDs.length - 1) {//Only do this once all of the events are in the array
                                console.log('Rendering home');
                                res.render('previousEvents.ejs', {
                                    user: req.user,
                                    events: prevEvents
                                });
                            }
                        });
                    }
                    if (eventIDs.length === 0) {
                        res.render('previousEvents.ejs', {
                            user: req.user,
                            events: prevEvents
                        });
                    }
                });
            });
        }
    });

    app.get('/dashboard', isLoggedIn, function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            res.render('dashboard.ejs', {
                user: req.user
            });
        }
    });

    //Only users who are logged in can access this... so we use the isLoggedIn function below
    app.post('/submitEvent', isLoggedIn, function (req, res, done) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            // Parse body of request to insert into event db
            let newEvent = new Event();

            newEvent.title = req.body.title;
            newEvent.address = req.body.address;
            newEvent.city = req.body.city;
            newEvent.state = req.body.state;
            newEvent.time = getMilliTime(req.body.time);
            newEvent.duration = getMilliDuration(req.body.days, req.body.hours, req.body.minutes);
            newEvent.capacity = req.body.capacity;
            newEvent.minAge = req.body.minAge;
            newEvent.description = req.body.description;

            //findEndTime(getMilliTime(req.body.time), getMilliDuration(req.body.days, req.body.hours, req.body.minutes));
            newEvent.save(function (err) {
                if(err) throw err;

                // Create EventManager for user that created event
                let newEventManager = new EventManager();

                newEventManager.userID = req.user._id;
                newEventManager.eventID = newEvent._id;
                newEventManager.isAdmin = true;
                newEventManager.numInvites = newEvent.capacity;

                newEventManager.save(function (err) {
                    if (err) throw err;
                    return done(null, newEventManager);
                });
                return done(null, newEvent);
            });
            req.flash('successfullyCreatedEvent', 'Successfully Created Event!');
            res.redirect('/home');
        }
    });

    app.get('/getEventDetails/*', isLoggedIn, function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            let id = '';

            let currChar = '';
            let numSlash = 0;
            //Parse the URL and find the eventid
            for (let i=0; i<req.url.length; i++){
                currChar = req.url.charAt(i);
                if(currChar === '/'){
                    numSlash++;
                    continue;
                }
                if(numSlash === 2) id += currChar;
            }

            console.log('Got URL: ' + req.url);
            console.log('Looking for eventid: ' + id);

            id = mongoose.Types.ObjectId('' + id + '');

            Event.findById(id, function (err, event) {
                if(err) throw err;

                let myEvent = {
                    _id : id,
                    title : event.title,
                    address : event.address,
                    city : event.city,
                    state : event.state,
                    time : event.time,
                    duration : event.duration,
                    capacity : event.capacity,
                    minAge : event.minAge,
                    description : event.description
                };

                console.log('FOUND: title: ' + event.title + ', description: ' + event.description);
                EventManager.findOne({eventID: event.id, userID: req.user._id}, function (err, element) {
                    if (err) throw err;
                    if(element){
                        console.log('I am inside of EVENT MANAGER isElement--------');
                        res.render('eventDetails.ejs', {
                            isAdmin: true,
                            user: req.user,
                            event: myEvent
                        });
                    }else {
                        console.log('I am inside of EVENT MANAGER isNotElement--------');
                        res.render('eventDetails.ejs', {
                            isAdmin: false,
                            user: req.user,
                            event: myEvent
                        });
                    }
                });
            });
        }
    });

    app.get('/getPrevEventAnalytics/*', isLoggedIn, function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            let id = '';

            let currChar = '';
            let numSlash = 0;
            //Parse the URL and find the eventid
            for (let i=0; i<req.url.length; i++){
                currChar = req.url.charAt(i);
                if(currChar === '/'){
                    numSlash++;
                    continue;
                }
                if(numSlash === 2) id += currChar;
            }

            console.log('Got URL: ' + req.url);
            console.log('Looking for eventid: ' + id);

            id = mongoose.Types.ObjectId('' + id + '');

            Event.findById(id, function (err, event) {
                if(err) throw err;

                let myEvent = {
                    _id : id,
                    title : event.title,
                    address : event.address,
                    city : event.city,
                    state : event.state,
                    time : event.time,
                    duration : event.duration,
                    capacity : event.capacity,
                    minAge : event.minAge,
                    description : event.description
                };

                console.log('FOUND: title: ' + event.title + ', description: ' + event.description);
                let isAdmin = false;
                EventManager.findOne({eventID: event.id, userID: req.user._id}, function (err, element) {
                    if (err) throw err;
                    isAdmin = element.isAdmin;

                    res.render('dashboard.ejs', {
                        isAdmin: isAdmin,
                        user: req.user,
                        event: myEvent,

                    });
                });

            });
        }
    });


    //Only users who are logged in can access this... so we use the isLoggedIn function below
    app.post('/editEvent', isLoggedIn, function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{

            Event.findOneAndUpdate({_id: req.body.editEventID},{$set:{
                    title : req.body.title,
                    address : req.body.address,
                    city : req.body.city,
                    state : req.body.state,
                    time : getMilliTime(req.body.time),
                    duration : getMilliDuration(req.body.days, req.body.hours, req.body.minutes),
                    capacity : req.body.capacity,
                    minAge : req.body.minAge,
                    description : req.body.description
                }}, function (err, doc) {
                if (err) throw err;
            });

            res.redirect('/home');
        }
    });

    app.get('/rsvp', isLoggedIn, function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            res.render('rsvp.ejs', {
                user: req.user
            });
        }
    });

    app.post('/scanqr', isLoggedIn, function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            res.render('scanqr.ejs', {
                user: req.user
            });
        }
    });

    app.get('/logout', function (req, res) {
        req.logout(); //Function provided by the passport library
        res.redirect('/'); //Bring the user back to the login screen
    });

    app.get('/logo.png', function(req, res) {
        res.send('/public/images/logo.png');
    });

    app.get('/instascan.min.js', function(req, res){
        res.sendFile(path.join(__dirname, '..', 'minJS', 'instascan.min.js'));
    });

    app.get('/qrcode.min.js', function(req, res){
        res.sendFile(path.join(__dirname, '..', 'minJS', 'qrcode.min.js'));
    });

    app.post('/checkinEvent', function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            let userid = mongoose.Types.ObjectId(req.body.userid);
            let eventid = mongoose.Types.ObjectId(req.body.eventid);
            let isCheckin = req.body.isCheckin;// 0 == checkin and 1 == checkout
            let currentGMT = new Date().getTime();
            let currentTime = new Date(currentGMT - 14400000);

            //Do the db stuff and at the end send back a status code
            if (isCheckin === 0) {
                Attendee.findOneAndUpdate({eventID: eventid, userID: userid}, {$set: {timeIn: currentTime}}, function (err) {
                    if (err) throw err;
                    res.status(204).send();
                })
            } else if (isCheckin === 1) {
                Attendee.findOneAndUpdate({eventID: eventid, userID: userid}, {$set: {timeOut: currentTime}}, function (err) {
                    if (err) throw err;
                    res.status(204).send();
                })
            }
        }
    });

    app.get('/addUserToEvent/*', function (req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        else{
            let id = '';

            let currChar = '';
            let numSlash = 0;
            //Parse the URL and find the eventid
            for (let i=0; i<req.url.length; i++){
                currChar = req.url.charAt(i);
                if(currChar === '/'){
                    numSlash++;
                    continue;
                }
                if(numSlash === 2) id += currChar;
            }

            console.log('Got URL: ' + req.url);
            console.log('Looking for eventid: ' + id);
            console.log('Looking for userid: ' + req.user._id);

            Event.findById(id, function (err, event) {
                if (err) throw err;

                //Make sure the event exist. If not, return home.

                if(event){

                    Attendee.findOne({'userID': req.user._id, 'eventID': id}, function (err, attendee) {
                        if (err) return err;

                        //If the person is already registered for event redirect home
                        if (attendee) {
                            res.redirect('/home');
                        }
                        else {
                            let attendee = new Attendee();

                            attendee.userID = req.user._id;
                            attendee.eventID = id;

                            attendee.save(function (err) {
                                if (err) throw err;
                                res.redirect('/home');
                            });
                        }
                    });
                }
                else res.redirect('/home');
            });
        }
    });
};

//Middleware to create an event and add it to the db
function createEvent(req, res, next){
    //Take the request body... parse it and add the event to the db
    //Once done---> return next();
}

//Middleware to make sure a user is authenticated...next will render the profile page if a user is auth if not back to login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    else res.redirect('/');
}

// Takes in duration in days, hours, and minutes
// and returns the duration in seconds
function getMilliDuration(days, hours, minutes) {
    let duration = 0;
    duration += (days * 86400000);
    duration += (hours * 3600000);
    duration += (minutes * 60000);
    return duration;
}

// Takes a Time & Date in string form and returns the millisecond equivalent
function getMilliTime (time) {
    let newString = time.toString();
    const semiPos = newString.indexOf(':');
    const commaPos = newString.indexOf(',');

    let hour = Number(newString.slice(0, semiPos));
    let min = Number(newString.slice(semiPos + 1, commaPos));
    let year = Number(newString.slice(6, 10));
    let month = Number(newString.slice(11, 13))-1;
    let day = Number(newString.slice(14, 16));

    const offset = (new Date().getTimezoneOffset()) * 60000;
    return new Date(Date.UTC(year, month, day, hour, min) + offset);
}
