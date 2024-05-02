const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    googleId: {
        type: String
    },
    surname: {
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
    
})

module.exports = mongoose.model('User', userSchema)