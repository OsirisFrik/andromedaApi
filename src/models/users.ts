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
	firstName: string;
	lastName: string;
	age: number;
	inapam?: string;
	inapamValidated?: boolean;
	phone?: string;
  email: string;
	password: string;
	provider: boolean;
  tokens:[string];
  devices: [string];
  fullName: string;
}



const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
	},
	lastName:{
		type: String,
		required: true,
		trim: true
	},
	age: {
		type: Number,
		min: 12,
		required: true
	},
	phone: {
		type: String,
		required: false,
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
		required: true,
		minlength: 4
	},
	provider: {
		type: Boolean,
		default: false
	},
	tokens: [String],
	devices: [String]
},{versionKey:false});

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
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
	delete userObject.tokens;
	delete userObject.firstName;
	delete userObject.lastName;
	userObject.fullName = this.fullName;

  return userObject;
}
userSchema.methods.generateAuthToken = async function (): Promise < String > {
  const user = this;
  const token = jwt.sign({
    _id: user._id.toString()
  }, process.env.SECRET!);

  user.tokens.push(token);
  await user.save();

  return token;
}

userSchema.virtual('fullName').get(function(this: {firstName: String, lastName: String}){
	return this.firstName + " " + this.lastName;
});
//for population
userSchema.virtual('myOrders', {
	ref: 'Orders',
	localField: '_id',
	foreignField: 'owner',
	justOne: true
});

userSchema.virtual('theirOrders', {
	ref: 'User',
	localField: '_id',
	foreignField: 'provider',
	justOne: true
});
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
const User = model < IUser, IUserModel > ("User", userSchema);

export default User;