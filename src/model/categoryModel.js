const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    categoryImg: {
        type: Object,
        required: true,
        default: null,
    },
    },
    {timestamps: true},
)

module.exports = mongoose.model("Category", categorySchema)