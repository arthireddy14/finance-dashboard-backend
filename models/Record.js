const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: Number,
  type: {
    type: String,
    enum: ['income', 'expense']
  },
  category: String,
  date: {
    type: Date,
    default: Date.now
  },
  notes: String
});

module.exports = mongoose.model('Record', recordSchema);