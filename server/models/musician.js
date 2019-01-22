
const mongoose = require('mongoose');
const musicianSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dob: Date,
    instruments: [String],
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Musician', musicianSchema);
