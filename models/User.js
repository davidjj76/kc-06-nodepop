const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let User;

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
    validate(email) {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    },
  },
  password: {
    type: String,
    required: true,
  },
}, {
  // Schema options
  timestamps: { createdAt: 'registeredAt' },
});

// don't show password at JSON responses
userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});

// hooks (hash user password before save)
userSchema.pre('save', function (next) {
  const user = this;
  // not hash if password is not modified
  if (!user.isModified('password')) {
    return next();
  }
  // hash password with bcrypt
  bcrypt.genSalt()
    .then(salt => bcrypt.hash(user.password, salt))
    .then((hash) => {
      user.password = hash;
      return next();
    })
    .catch(err => next(err));
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
    return Promise.all(users.map(user => User.create(user)));
  },
  findById(_id) {
    return User.findOne({ _id }).exec();
  },
  findByEmail(email) {
    return User.findOne({ email }).exec();
  },
};

// instance methods
userSchema.methods = {
  register() {
    return this.save();
  },
  comparePassword(candidatePassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, this.password, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res ? this : null);
      });
    });
  },
};

// create and export model
User = mongoose.model('User', userSchema);
module.exports = User;
