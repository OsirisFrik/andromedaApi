import {
  model,
  Schema,
  Document,
  Model,
	Types
} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface IUserSchema extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  tokens: Types.Array<ITokens>
}
export interface ITokens extends Types.Subdocument {
	_id: Types.ObjectId;
	token: string;
}


const tokenSchema = new Schema({
	_id: Types.ObjectId,
	token: {
		type: String,
		required: true
	}
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  tokens: [tokenSchema]
});


userSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({
    email
  })

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
}

userSchema.methods.toJSON = function (): Object {
  const user = this
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}
userSchema.methods.generateAuthToken = async function (): Promise < String > {
  const user = this;
  const token = jwt.sign({
    _id: user._id.toString()
  }, 'secretlol');

  user.tokens = user.tokens.concat({
    token
  });
  await user.save();

  return token;
}

export interface IUser extends IUserSchema {
  generateAuthToken(): Promise < string > ;
  toJSON(): Object;
}

userSchema.pre < IUser > ('save', async function (next) {
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

export interface IUserModel extends Model < IUser > {
  findByCredentials(email: string, password: string): IUser;
}
// userSchema.methods.validatePassword = async function(password: string):Promise<boolean>{
//     return await bcrypt.compare(password, this.password);
// }
const User = model < IUser,
  IUserModel > ("User", userSchema);

export default User;