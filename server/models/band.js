const mongoose = require('mongoose');
const bandSchema = new mongoose.Schema({
    name: String,
    genre: String,
    bandMemberIds: [String],
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Band', bandSchema);