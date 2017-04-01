let User;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    index: { unique: true },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static methods
userSchema.statics = {
  list() {
    return User.find().exec();
  },
  delete() {
    return User.deleteMany().exec();
  },
  insert(users) {
    return User.insertMany(users);
  },
};

// instance methods
userSchema.methods = {
  register() {
    return this.save();
  },
};

// create and export model
User = mongoose.model('User', userSchema);
module.exports = User;
