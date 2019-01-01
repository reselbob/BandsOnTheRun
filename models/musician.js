
const mongoose = require('mongoose');
const musicianSchema = new mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    dob: Date,
    instruments: [String]
});
module.exports = mongoose.model('Musician', musicianSchema);
