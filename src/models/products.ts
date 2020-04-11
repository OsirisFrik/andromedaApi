import {
  model,
  Schema,
  Document,
  Model,
  Types
} from 'mongoose';

interface IProductSchema extends Document {
  _id: Types.ObjectId;
  name: String;
  tags: Array<String>;
  brands: Array<String>;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

const ProductSchema = new Schema ({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    _id: false
  }],
  brands: [{
    type: String,
    _id: false
  }],
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

ProductSchema.methods.findByName = async (name: string) => {
  const products = await Product.find({ name });

  return products;
}

ProductSchema.methods.findByTag = async (tag: string) => {
  let products = await Product.find({ tags: tag });

  return products;
}

export interface IProduct extends IProductSchema {}

export interface IProductModel extends Model <IProduct> {
  findByName(name: String): Promise <[IProduct]>;
  findByTag(tag: String): Promise <[IProduct]>;
}

const Product = model<IProduct, IProductModel>('Product', ProductSchema);

export default Product;
