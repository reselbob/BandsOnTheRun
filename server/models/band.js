const mongoose = require('mongoose');
const bandSchema = new mongoose.Schema({
    name: String,
    genre: String,
    bandMemberIds: [String]
});
module.exports = mongoose.model('Band', bandSchema);