import { Router } from 'express';
import { UserController } from '../controllers/usersControllers';
import { Auth } from '../middleware/auth';

export default class UserRoutes {

  router: Router;
  auth: Auth = new Auth();
  public userController: UserController = new UserController();

  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    this.router.get('/', this.auth.Authenticate, this.userController.getProfile);
    this.router.get("/logout", this.auth.Authenticate, this.userController.logout);

    this.router.post("/register", this.userController.registerUser);
    this.router.post("/login", this.userController.authenticateUser);
    this.router.post('/address', this.auth.Authenticate, this.userController.addAddress);

    this.router.put('/address', this.auth.Authenticate, this.userController.updateAddress);
  }
}