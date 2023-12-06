const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Defining the schema for the User model
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
  }
  next();
});

// Exporting the User model based on the defined schema
module.exports = mongoose.model('User', userSchema);
