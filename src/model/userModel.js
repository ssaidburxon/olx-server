const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
        },
        name: {
            type: String,
        },
        surname: {
            type: String,
        },
        password: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: Object || String,
            default: null,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Users", userSchema);