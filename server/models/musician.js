
const mongoose = require('mongoose');
const musicianSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dob: Date,
    instruments: [String]
});
module.exports = mongoose.model('Musician', musicianSchema);
