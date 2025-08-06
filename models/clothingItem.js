const mongoose = require('mongoose');
const validator = require('validator');

// Define the item schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: {type: String, required: true, enum: ['hot', 'warm', 'cold'] },
  imageUrl: { type: String, required: true},
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'user', default: [] }, // Array of user IDs who liked the item
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("item", itemSchema);