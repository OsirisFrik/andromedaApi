import { Request, Response, NextFunction } from "express";
import User, { IUser } from '../models/users';
import Address, { IAddress } from "../models/addresses";

export class UserController {
  public async registerUser(req: Request, res: Response): Promise < void > {
    let user = new User(req.body);
    try {
      await user.save()
      let token = await user.generateAuthToken();
      res.status(201).send({
        user,
        token
      });
    } catch (e) {
      res.status(400).send(e);
    }
  }

  public async authenticateUser(req: Request, res: Response) {
    try {
      let user = await User.findByCredentials(req.body.email, req.body.password);
      let token = await user.generateAuthToken();
      res.send({
        user,
        token
      });
    } catch (e) {
      res.status(400).send()
    }
  }

  public async getProfile(req: Request, res: Response) {
    try {
      let user: IUser = req.user!
      
      res.send({
        user: await User.findById(user._id, { __v: false, tokens: false })
      });
    } catch (err) {
      res.status(500).send(err);
    }
  } 

  public async addAddress(req: Request, res: Response) {
    try {
      let user: IUser = req.user!;
      let data = req.body;
      let address = new Address({
        user: user._id,
        ...data
      });

      await address.save();

      res.send(address.toJSON());
    } catch (err) {
      res.status(500).send(err);
    }
  }

  public async updateAddress(req: Request,  res: Response) {
    try {
      let user: IUser = req.user!;
      let address: IAddress = await Address.findByUser(user._id);
      let data: IAddress = {
        ...req.body,
        updatedAt: new Date()
      };

      await address.update(data);

      res.send({ address: await Address.findById(address._id) });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}