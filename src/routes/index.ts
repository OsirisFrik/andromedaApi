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
	}
}