import { model, Schema, Document, Model, Types } from 'mongoose';
import User, { IUser } from './users';

interface ILoc {
  type: String;
  coordinates: Array<Number>;
}

interface IAddressSchema extends Document {
  user: IUser | Types.ObjectId;
  address: String;
  zipCode: String;
  loc: ILoc;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

const AddressSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User'
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
  loc: {
    'type': {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
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

AddressSchema.index({ loc: '2dsphere' })

AddressSchema.methods.findByUser = async (user: string | Types.ObjectId): Promise<IAddress | null> => {
  let address = await Address.findOne({ user: user });

  return address;
}

AddressSchema.statics.findNearProviders = async (address: IAddress, maxDist: number = 2000): Promise<Array<IAddress>> => {
  let providers: Array<IAddress> = await Address.find({
    loc: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: address.loc.coordinates
        },
        $maxDistance: maxDist
      }
    },
    user: {
      $ne: address.user
    }
  }).populate('user').exec();

  providers = providers.filter(item => {
    if (item.user instanceof User) {
      return item.user.provider;
    }

    return false;
  })

  return providers;
}

AddressSchema.statics.findNearUsers = async (address: IAddress, maxDist: number = 2000): Promise<Array<IAddress>> => {
  let addresses = await Address.find({
    loc: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: address.loc.coordinates
        },
        $maxDistance: maxDist
      }
    },
    user: {
      $ne: address.user
    }
  }).populate('user').exec();

  addresses = addresses.filter(item => {
    if (item.user instanceof User) {
      return !item.user.provider;
    }

    return false;
  });

  return addresses;
}

export interface IAddress extends IAddressSchema {}

export interface IAddressModel extends Model <IAddress> {
  findByUser(user: string | Types.ObjectId): IAddress;
  findNearProviders(address: IAddress, maxDist: number): Promise<Array<IAddress>>;
  findNearUsers(address: IAddress, maxDist: number): Promise<Array<IAddress>>;
}

const Address = model<IAddress, IAddressModel>('Address', AddressSchema);

export default Address;
