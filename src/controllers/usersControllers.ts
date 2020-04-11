import { Request, Response, NextFunction } from "express";
import User from '../models/users';
import { token } from "morgan";

export class UserController {
  public async registerUser(req: Request, res: Response): Promise < void > {
    const user = new User(req.body);
    try {
			await user.save();
			const token = await user.generateAuthToken();
      res.status(201).send({
        user,
        token
      });
    } catch (e) {
      res.status(400).send(e);
    }
  }

  public async authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      res.send({
        user,
        token
      });
    } catch (e) {
      res.status(400).send();
    }
	}
	public async logout(req: Request, res: Response, next: NextFunction){
		try {
			if(!req.user || !req.user.tokens) throw new Error("Auth");
				req.user.tokens = <any>req.user.tokens.filter(function(token){
				return token !== req.token;
			});
			await req.user.save();
			res.send("Successfully logged out");
		} catch (error) {
			res.status(500).send("Error on logout");
		}
	}
	/**
	 * getCurrentUser
	 */
	public async getCurrentUser(req: Request, res: Response, next: NextFunction){
		return res.status(200).send(req.user);
	}
}