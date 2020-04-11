import {Router} from 'express';
import {UserController} from '../controllers/usersControllers';
import {Auth} from '../middleware/auth';

export default class UserRoutes {

    router: Router;
    public userController: UserController = new UserController();
    private Auth: Auth = new Auth;

    constructor() {
        this.router = Router();
        this.routes();
    }
    routes() {
        this.router.post("/register", this.userController.registerUser);
        this.router.post("/login", this.userController.authenticateUser);
        this.router.post('/logout', this.Auth.Authenticate, this.userController.logout)
    }
}