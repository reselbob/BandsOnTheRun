const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    name: String,
    createdAt: Date,
    storedAt: { type: Date, default: Date.now },
    payload: String,
});
module.exports = mongoose.model('Event', eventSchema);