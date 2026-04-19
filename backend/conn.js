const mongoose = require('mongoose')
const URL = process.env.MONGO_URI

mongoose.connect(URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  })

mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', console.error.bind(console, 'DB ERROR: '))

module.exports = {db, mongoose}