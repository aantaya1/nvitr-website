let Event = require('./server/models/events');

module.exports = function (app) {

    /* Queries the database for all the times stored and there associated Obj_id
    * evaluates whether the time has passed. If the time has passed set the event
    * completed field to completed
    */
    function queryTime() {
        let rightNow = new Date().getTime();
        //console.log("Time Right Now = " + rightNow);
        Event.find({}, {_id: 1, time: 1, duration: 1, completed: 1}, function (err, elements) {
            if (err) throw err;

            elements.forEach(function (ele) {
                if (ele._id === null) return;

                let storedTime = ele.time.getTime();
                if (rightNow > storedTime && ele.completed !== true) {
                    console.log(storedTime + "This stored time got me in for " + ele.name);
                    Event.findOneAndUpdate({_id: ele._id}, {$set: {completed: true}}, function(err) {
                        if (err)  throw err;
                        else { console.log("Event Completion Updated"); }
                    });
                }
            });
        });
    }

    setTimeout(queryTime, 500);

    /* Refreshes the events database every 5 min to see if
     * if an event has passed
    */
    setInterval(queryTime, 300000);
};