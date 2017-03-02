const mongoose = require('mongoose')
const collection = 'clients'

const ClientSchema = new mongoose.Schema({
  name: String,
  surname: String,
  address: String,
  age: Number,
  profession: String
}, { collection })

module.exports = mongoose.model('Client', ClientSchema)