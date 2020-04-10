import {
  model,
  Schema,
  Document
} from "mongoose";
import bcrypt from 'bcrypt';

export interface User extends Document {
  email: string;
  password: string;
};

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre < User > ('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;

    next();

  } catch (error) {
    console.log('An error has occurred', error);
  }

});

export default model('users', userSchema);