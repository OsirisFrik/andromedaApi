import { Request, Response, NextFunction } from "express";

export default class IndexController{
	public getInfoPage(req: Request, res: Response, next: NextFunction): void{
		res.render('index', {
			title: 'dashboard',
			pageName: 'Dashboard'
		});
	}
	public renderUserLogin(req: Request, res: Response){
    res.render('login', {
      layout: 'login',
      title: 'login'
    });
	}
	
	public renderBusinessReg(req: Request, res: Response){
		res.render('busReg', {
			title: 'Registra tu negocio',
			layout: 'login'
		})
	}

	public showProfile(req: Request, res: Response){
		res.render('perfil', {
			title: 'perfil',
			pageName:'Mi Perfil'
		})
	}

	public showSales(req: Request, res:Response): void{
		res.render('tableSales', {
			title: 'Ventas',
			pageName: 'Compras'
		})
	}
	public showProducts(req: Request, res: Response): void {
		res.render('products', {
			title: 'mis productos',
			pageName: 'Productos'
		})
	}

	public getInformationUser(req: Request, res: Response): void{
		res.render('information', {
			title: 'Informacion',
			pageName: 'Información'
		})
	}

}