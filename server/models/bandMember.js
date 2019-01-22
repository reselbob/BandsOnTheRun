
const mongoose = require('mongoose');
const bandMemberSchema = new mongoose.Schema({
    musicianId: String,
    bandId: String,
    startDate: Date,
    endDate: Date,
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('BandMember', bandMemberSchema);