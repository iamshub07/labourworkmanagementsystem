const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
    userid:{
        type: Number,
        required:true,
        unique:true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    isowner:{
        type: Boolean,
        required:true
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String
    },
    date: {
        type:Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);