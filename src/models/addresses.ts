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

AddressSchema.methods.findNearProviders = async (coords: Array<number>, maxDist: number = 2000): Promise<Array<IAddress>> => {
  let providers = await Address.find({
    loc: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coords.reverse()
        },
        $maxDistance: maxDist
      }
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
