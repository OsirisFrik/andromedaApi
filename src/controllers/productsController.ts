import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/products';

export default class ProductController {
  public async addProduct(req: Request, res: Response): Promise<void> {
    let body = req.body;

    if (!Array.isArray(body)) {
      let product = new Product(body);

      try {
        await product.save();
        res.status(200).send({ product })
      } catch (err) {
        res.status(400).send(err);
      }
    } else {
      let errors = [];
      let products = [];
      try {
        for (let i = 0; i < body.length; i++) {
          const product = await new Product(body[i]);
          products.push(product.toJSON());
        }
      } catch (err) {
        errors.push(err);
      }

      res.send({
        products,
        errors
      });
    }
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    try {
      let products = await Product.find({ deletedAt: null });

      res.status(200).send({ products });
    } catch (err) {
      res.status(400).send(err);
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      let product = await Product.findById(req.params.id);
      
      if (product) {
        let data = {
          ...req.body,
          updatedAt: new Date()
        }

        await product.update(data);

        res.status(200).send({ product: await Product.findById(product._id) });
      } else {
        res.status(404).send({ error: 'not found' });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        deletedAt: Date.now()
      })

      res.status(200).send();
    } catch (err) {
      res.status(500).send(err)
    }
  }
}
