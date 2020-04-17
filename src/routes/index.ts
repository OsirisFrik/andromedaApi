import {Router} from 'express';
import {Auth} from '../middleware/auth';
import indexController from '../controllers/index';

export default class indexRouter{

	router: Router;
	public auth = new Auth;
	public indexController:indexController = new indexController();

	constructor(){
		this.router = Router();
		this.routes();
	}

	routes(): void{
		this.router.get('/', this.indexController.getInfoPage);
		this.router.get('/login', this.indexController.renderUserLogin);
		this.router.get('/bus-register', this.indexController.renderBusinessReg);
		this.router.get('/perfil', this.indexController.showProfile);
		this.router.get('/sales', this.indexController.showSales);
		this.router.get('/products', this.indexController.showProducts);
		this.router.get('/info', this.indexController.getInformationUser);
	}
}