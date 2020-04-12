import { Request, Response, NextFunction } from 'express';
import Order, {IOrder} from '../models/orders';

export default class OrderController {
	public async getOrders(req: Request, res: Response){
		try {
			if(!req.user) throw new Error();
			let orders = await Order.find({owner: req.user._id});

			res.send(orders);
		} catch (e) {
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
			let update = {status: req.body.status};

			if(!filter._id || !update.status) throw new Error();

			await Order.findOneAndUpdate(filter, update, {runValidators: true});

			res.send("Updated successfully");
			// if(order === null){
			// 	return res.status(200).send('There is not an Order with that ID');
			// }
		} catch (e) {
			res.status(400).send({
				error: e,
				message: "Bad Request"
			});
		}
	}

	public async asignProvider(req: Request, res: Response){
		try {
			if(!req.user) throw new Error();
			let order = <IOrder>await Order.findById(req.params.id);
			let update = {provider: req.user._id};

			if(order.owner.equals(update.provider)){
				throw new Error("Can't set an owner as provider in the same Order");
			}
			
			await order.updateOne(update,{runValidators: true});

			res.send("User successfully asign");

		} catch (e) {	
			res.status(400).send({
				error: e.message,
				message: "Bad Request"
			});
		}
	}
}