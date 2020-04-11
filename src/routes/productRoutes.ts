import { Router } from 'express';
import ProductsCtrl from '../controllers/productsController';

export default class ProductRoutes {
  router: Router;
  public productCtrl: ProductsCtrl = new ProductsCtrl();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post('/', this.productCtrl.addProduct);
    this.router.get('/', this.productCtrl.getProducts);
    
    this.router.put('/:id', this.productCtrl.updateProduct);
    this.router.delete('/:id', this.productCtrl.deleteProduct);
  }
}
