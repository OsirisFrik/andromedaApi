import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from "express";
import User from '../models/users';

export class Auth{
	
	public async Authenticate (req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.header('Authorization');
			if(!token) throw new Error();
			token.replace('Bearer', " ");
			const decoded = <any>jwt.verify(token, 'thisismynewcourse');
			const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

			if (!user) {
					throw new Error();
			}
			req.token = token;
			req.user = user;
			next();
		} catch (e) {
				res.status(401).send({ error: 'Please authenticate.' });
		}
	}
}		