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
        this.router.get("/me", this.Auth.Authenticate, this.userController.getCurrentUser);
        this.router.get("/logout", this.Auth.Authenticate, this.userController.logout);
    }
}