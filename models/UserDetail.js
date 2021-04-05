const mongoose = require('mongoose');

const UserdetailSchema  = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userid:{
        type:Number,
        required:true
    },
    designation:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: false    
    },
    mobile:{
        type: String,
        required: true    
    },
    date: {
        type:Date,
        default: Date.now
    }
});

module.exports = UserDetail = mongoose.model('userdetail', UserdetailSchema);