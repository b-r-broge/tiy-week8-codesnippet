const mongoose = require('mongoose');
const Schema = mongoose.Schema
const User = require('./users')

const snippetSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  snippet: {
    type: String
  },
  notes: {
    type: String
  },
  language: {
    type: String
  },
  _creator: {
    type: Schema.Types.ObjectId,
    ref: User
  },
  tags: [String]
})



const Snippet = mongoose.model('Snippet', snippetSchema, 'snippet');

module.exports = Snippet
