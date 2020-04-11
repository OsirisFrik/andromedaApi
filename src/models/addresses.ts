import {
  model,
  Schema,
  Document,
  Model,
  Types
} from 'mongoose';

interface IAddressSchema extends Document {
  user: Types.ObjectId;
  address: String;
  zipCode: String;
  coords: [Number];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

const AddressSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'users'
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true
  },
  coords: {
    type: [Number],
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

AddressSchema.methods.findByUser = async (user: string | Types.ObjectId): Promise<IAddress | null> => {
  let address = await Address.findOne({ user: user });

  return address;
}

export interface IAddress extends IAddressSchema {}

export interface IAddressModel extends Model <IAddress> {
  findByUser(user: string | Types.ObjectId): IAddress;
}

const Address = model<IAddress, IAddressModel>('Address', AddressSchema);

export default Address;
