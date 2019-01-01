const mongoose = require('mongoose');
class Database {
  constructor() {
    this._connect()
  }
_connect() {
     mongoose.connect(`mongodb://${process.env.USER}:${process.env.PWD}@ds061661.mlab.com:61661/${process.env.DB}`)
       .then(() => {
           mongoose.connection.once('open', () => {
               console.log('connected to database');
           });
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }

  close() {
      mongoose.disconnect();
  }
}


module.exports = new Database();