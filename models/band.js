const mongoose = require('mongoose');
const bandSchema = new mongoose.Schema({
    id: String,
    name: String,
    bandId: String,
    bandMemberIds: [String]
});
module.exports = mongoose.model('Band', bandSchema);