const mongoose = require('mongoose');
const albumSchema = new mongoose.Schema({
    id: String,
    title: String,
    releaseDate: Date,
    bandId: String,
    musicianId: String,
    bandId: String,
    songIds: [String] 
});
module.exports = mongoose.model('Album', albumSchema);