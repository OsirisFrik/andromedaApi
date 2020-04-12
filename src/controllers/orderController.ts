import { Request, Response, NextFunction } from 'express';
import Order, {IOrder} from '../models/orders';
import { IUser } from '../models/users';

export default class OrderController {
	public async getOrders(req: Request, res: Response){
		try {
			if(!req.user) throw new Error();
			let orders = await Order.find({owner: req.user._id});

			res.send(orders);

		} catch (e) {
			console.log(e);
			res.status(400).send(e);
		}
	}
	public async createOrder(req: Request, res: Response): Promise<void>{
		try {
			if(!req.user) throw new Error();
			let orderReq = {
				items : req.body.items,
				owner: req.user._id	 
			}
			let order = new Order(orderReq);
			await order.save();
			res.send(order);
		} catch (e) {
			console.log(e);
			res.status(400).send(e);
		}
	}
	public async updateOrderStatus(req: Request, res: Response){
		try {
			let filter  = {_id: req.params.id};
			let update = {status: req.body.status}
			let order = await Order.findOneAndUpdate(filter,update, {runValidators: true});
			res.send(order);
			// if(order === null){
			// 	return res.status(200).send('There is not an Order with that ID');
			// }
		} catch (e) {
			res.status(400).send(e)
		}
	}

}