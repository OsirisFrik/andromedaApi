import { Request, Response, NextFunction } from "express";
import User from '../models/users';

export class UserController {
	public async registerUser(req: Request, res: Response): Promise<void> {
		const user = new User(req.body);
		try {
				await user.save()
				const token = await user.generateAuthToken();
				res.status(201).send({ user, token });
		} catch (e) {
				res.status(400).send(e);
		}
			res.status(200);
		}
	
	public async authenticateUser(req: Request, res: Response, next: NextFunction){
		try {
			const user = await User.findByCredentials(req.body.email, req.body.password);
			const token = await user.generateAuthToken();
			res.send({ user, token });
		} catch (e) {
				res.status(400).send()
		}
	}
}