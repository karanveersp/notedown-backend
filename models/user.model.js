const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const isEmail = require('validator').isEmail;
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail, 'invalid email'],
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
});
userSchema.plugin(uniqueValidator);

userSchema.virtual('numberofnotes').get(() => this.notes.length);

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    return next();
  } catch (err) {
    return next(err);
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
