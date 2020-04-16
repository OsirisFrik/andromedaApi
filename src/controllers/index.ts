import { Request, Response, NextFunction } from "express";

export default class IndexController{
	public getInfoPage(req: Request, res: Response, next: NextFunction): void{
		res.render('users', {
			title: 'dashboard'
		});
	}
}