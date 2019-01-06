
const mongoose = require('mongoose');
const bandMemberSchema = new mongoose.Schema({
    musicianId: String,
    bandId: String,
    startDate: Date,
    endDate: Date
});
module.exports = mongoose.model('BandMember', bandMemberSchema);