const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
// var randomBytes = require('randombytes');
const Schema = mongoose.Schema;

// EventManagers Schema
const eventManagerSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    eventID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    numInvites: {
        type: Number
    }
});

/*
let encKeyEM = randomBytes(32);
let sigKeyEM = randomBytes(64);

eventManagerSchema.plugin(encrypt, { encryptionKey: encKeyEM, signingKey: sigKeyEM });
*/


const EventManager = mongoose.model('eventManager', eventManagerSchema);
module.exports = EventManager;