import {
  model,
  Schema,
  Document,
  Model,
  Types
} from 'mongoose';

interface ILoc {
  type: String;
  coordinates: Array<Number>;
}

interface IAddressSchema extends Document {
  user: Types.ObjectId;
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

AddressSchema.methods.findNearProviders = async (address: IAddress, maxDist: number = 2000): Promise<Array<IAddress>> => {
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
  });

  return providers;
} 

export interface IAddress extends IAddressSchema {}

export interface IAddressModel extends Model <IAddress> {
  findByUser(user: string | Types.ObjectId): IAddress;
  findNearProviders(coords: Array<number>, maxDist: number): Promise<Array<IAddress>>;
}

const Address = model<IAddress, IAddressModel>('Address', AddressSchema);

export default Address;
