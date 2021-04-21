const mongoose = require('mongoose');

const workschema  = new mongoose.Schema({
    groupid:{
        type:Number,
        required:true
    },
    work:[{
        ownerid:{
            type: Number,
            required: true
        },   
        sack : {
            type:Number,
            required:true,
            default:0
        }    
    }],
    leaderid:{
        type: Number,
        required: true
    },
    date: {
        type:Date,
        default: Date.now
    }
});

module.exports = DailyWork = mongoose.model('work', workschema);