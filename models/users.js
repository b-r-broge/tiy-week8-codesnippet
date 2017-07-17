const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.pre('save', function(next){
  // if the password hasn't been modified we don't need to (re)hash it
  if (!this.isModified('password')) {
    return next();
  }
  var hash = bcrypt.hashSync(this.password, 8);
  this.password = hash;
  next();
})


const User = mongoose.model('User', userSchema, 'users');

module.exports = User
