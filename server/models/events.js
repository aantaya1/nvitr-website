const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
// var randomBytes = require('randombytes');
const Schema = mongoose.Schema;

//Event Schema
const eventsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    time: {
        type: Date,
    },
    duration: {
        type: Number, // Duration of event in seconds
    },
    capacity: {
        type: Number,
    },
    minAge: {
        type: String
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    }
});

/*let encKeyEvent = randomBytes(32);
let sigKeyEvent = randomBytes(64);

eventsSchema.plugin(encrypt, { encryptionKey: encKeyEvent, signingKey: sigKeyEvent });*/

const Event = mongoose.model('event', eventsSchema);
module.exports = Event;