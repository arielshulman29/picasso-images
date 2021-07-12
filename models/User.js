const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  profileUrl: {
    type: String,
    required: true
  }
})

UserSchema.plugin(findOrCreate);
module.exports = mongoose.model('User', UserSchema)