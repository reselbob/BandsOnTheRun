const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
    title: String,
    runtime: Number,
    createdAt: {type: Date, default: Date.now},
    musicianIds: [String]
});
module.exports = mongoose.model('Song', songSchema);