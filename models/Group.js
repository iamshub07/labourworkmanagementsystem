const mongoose = require('mongoose');

const GroupSchema  = new mongoose.Schema({
    groupid:{
        type:Number,
        required:true
    },
    owners:[{
        userid:{
            type: Number,
            required: true
        }        
    }],
    leaderid:{
        type: Number,
        required: true
    }
});

module.exports = Group = mongoose.model('group', GroupSchema);