const mongoose = require('mongoose');
const albumSchema = new mongoose.Schema({
    title: String,
    releaseDate: Date,
    bandId: String,
    musicianId: String,
    bandId: String,
    songIds: [String],
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Album', albumSchema);