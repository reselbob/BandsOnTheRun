const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
  id: String,
  title: String,
  runtime: Number
});
module.exports = mongoose.model('Song', songSchema);