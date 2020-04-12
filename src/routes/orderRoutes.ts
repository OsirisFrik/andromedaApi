import {Router} from 'express';
import OrderController from '../controllers/orderController';
import {Auth} from '../middleware/auth';

export default class OrderRoutes {
    public orderController = new OrderController;
    router: Router;
    public auth = new Auth;
    constructor(){
        this.router = Router();
        this.routes();
    }
    public routes(){
        this.router.post('/add', this.auth.Authenticate, this.orderController.createOrder);
        
        this.router.put('/:id/status', this.auth.Authenticate, this.orderController.updateOrderStatus);
        this.router.put('/:id/asign', this.auth.Authenticate, this.orderController.asignProvider);

        this.router.get('/', this.auth.Authenticate, this.orderController.getOrders);
        this.router.get('/provider', this.auth.Authenticate, this.auth.isProvider, this.orderController.ordersToProvider);
    }
}