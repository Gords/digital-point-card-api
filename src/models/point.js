const mongoose = require('mongoose');


const pointSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, 
{
    timestamps:true
})

const Point = mongoose.model('Point', pointSchema)


module.exports = Point