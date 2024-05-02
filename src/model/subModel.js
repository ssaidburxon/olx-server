const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'type',
        required: true
    }
},
    { timestamps: true },
)

module.exports = mongoose.model("Sub", subSchema)