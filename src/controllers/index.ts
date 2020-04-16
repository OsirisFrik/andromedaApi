import { Request, Response, NextFunction } from "express";

export default class IndexController{
	public getInfoPage(req: Request, res: Response, next: NextFunction): void{
		res.render('users', {
			title: 'dashboard'
		});
	}
	public renderUserLogin(req: Request, res: Response){
		console.log('Users login')
    res.render('login', {
      layout: 'login',
      title: 'login'
    });
  }

}