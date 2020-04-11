import {
    model,
    Schema,
    Document,
    Model,
    Types
  } from 'mongoose';
import moment from 'moment';

const orderSchema:Schema = new Schema({
    owner: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    provider: {
        type: Types.ObjectId,
        required: false,
        ref: 'User'
    },
    listDetails: {
        type: Types.ObjectId,
        required: false
    },
    expiresAt: {
        type: Date,
        default: () => {
            return moment().add(4,'hours');
        }
    },
    status: {
        type: String,
        enum: ['created','looking','inProgress', 'Done', 'Delivered'],
        default: 'created'
    }
});

interface IOrder extends Document{
    owner: Types.ObjectId;
    provider: Types.ObjectId;
    listDetails: Types.ObjectId;
    expiresAt: Date;
    status: string;
}
//for population
orderSchema.virtual('owner', {
    ref: '',
    localField: '',
    foreignField: '',
    justOne: true
});

const Order: Model<IOrder> = model < IOrder >("Order", orderSchema);

export default Order;