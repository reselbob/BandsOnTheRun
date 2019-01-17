const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    name: String,
    date: String,
    payload: Date,
});
module.exports = mongoose.model('Event', eventSchema);