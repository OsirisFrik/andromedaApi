import {
    model,
    Schema,
    Document,
    Model,
    Types
  } from 'mongoose';
import moment from 'moment';

interface items extends Document{
	product: Types.ObjectId;
	quantity: number;
	maxPrice: number;	
}
const itemSchema: Schema = new Schema({
	product: {
		type: Types.ObjectId,
		required: true
	},
	quantity: Number,
	maxPrice: Number
}, {_id: false});

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
    items:[itemSchema],
    expiresAt: {
        type: Date,
        default: () => {
            return moment().add(4,'hours');
        }
    },
    status: {
        type: String,
        enum: ['created','looking','inProgress', 'Delivered', 'cancel'],
        default: 'created'
    }
}, {versionKey: false});


interface IOrderSchema extends Document{
	owner: Types.ObjectId;
	provider: Types.ObjectId;
	listDetails: [items];
	expiresAt: Date;
	status: string;
}


orderSchema.methods.findOrdersByUser = async(user: Types.ObjectId , typeUser: string = 'owner'):Promise<Array<IOrder>> => {
	// let query = {
	//     property: typeUser,
	//     value: user
	// }
	let orders: Array<IOrder> = await Order.find({owner: user});
	console.log(orders);
	return orders;
}

export interface IOrder extends IOrderSchema{}
export interface IOrderModel extends Model < IOrder > {
	findOrdersByUser(user: Types.ObjectId, typeUser?: String):Promise<Array<IOrder>>;
}

const Order = model < IOrder, IOrderModel >("Order", orderSchema);

export default Order;