const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
// var randomBytes = require('randombytes');
const Schema = mongoose.Schema;

//Attendees Schema
const attendeesSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    eventID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    timeIn: {
        type: Date,
    },
    timeOut: {
        type: Date,
    }
});

/*let encKeyAttendee = randomBytes(32);
let sigKeyAttendee = randomBytes(64);

attendeesSchema.plugin(encrypt, { encryptionKey: encKeyAttendee, signingKey: sigKeyAttendee });*/

const Attendee = mongoose.model('attendee', attendeesSchema);
module.exports = Attendee;