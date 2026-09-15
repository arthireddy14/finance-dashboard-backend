const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0.01, "Amount must be greater than 0"]
        },

        type: {
            type: String,
            enum: {
                values: ["income", "expense"],
                message: "Type must be either income or expense"
            },
            required: true,
            index: true
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            maxlength: 50,
            index: true
        },

        description: {
            type: String,
            trim: true,
            maxlength: 200
        },

        date: {
            type: Date,
            required: true,
            default: Date.now,
            index: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Record", recordSchema);