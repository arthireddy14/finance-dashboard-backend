<<<<<<< HEAD
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: ["viewer", "analyst", "admin"],
            default: "viewer"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
=======
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "viewer" }
});

module.exports = mongoose.model('User', userSchema);
>>>>>>> 38b555646dd126d50ae08556bdb6422047456ae9
