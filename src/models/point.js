const mongoose = require('mongoose');


const pointSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    }
}, 
{
    timestamps:true
})

const Point = mongoose.model('Point', pointSchema)


module.exports = Point