const mongoose = require('mongoose');
/*var encrypt = require('mongoose-encryption');
var randomBytes = require('randombytes');*/
const Schema = mongoose.Schema;
const passwordHash = require('password-hash');

//User Schema
const usersSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String
    },
});

// hash the password
usersSchema.methods.generateHash = function(password) {
    return passwordHash.generate(password);
};

//checking if password is valid
usersSchema.methods.validPassword = function(password) {
    return passwordHash.verify(password, this.password);
};

/*
let encKeyUser = randomBytes(32);
let sigKeyUser = randomBytes(64);

usersSchema.plugin(encrypt, { encryptionKey: encKeyUser, signingKey: sigKeyUser });
*/

const User = mongoose.model('user', usersSchema);
module.exports = User;