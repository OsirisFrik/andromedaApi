import {
  Request,
  Response
} from "express";
import User, {
  IUser
} from '../models/users';
import Address, {
  IAddress
} from "../models/addresses";
import Notifications from '../libs/pushNotifications';

const notifications: Notifications = new Notifications();

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
          user: await User.findById(user._id, {
            __v: false,
            tokens: false
          })
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  public async addAddress(req: Request, res: Response) {
    try {
      let user: IUser = req.user!;
      let body = req.body;
      let data = {
        ...body,
        user: user._id,
        loc: {
          coordinates: body.coordinates.reverse()
        }
      }
      console.log(data)
      let address = new Address(data);
      await address.save();

      res.send(address.toJSON());
    } catch (err) {
      res.status(500).send(err);
    }
  }

  public async updateAddress(req: Request, res: Response) {
    try {
      let user: IUser = req.user!;
      let address: IAddress = await Address.findByUser(user._id);
      let data: IAddress = {
        ...req.body,
        updatedAt: new Date()
      };

      await address.update(data);

      res.send({
        address: await Address.findById(address._id)
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  public async addTokenDevice(req: Request, res: Response) {
    try {
      let user = req.user!;
      user.devices?.push(req.body.token);
      await user.save();

      res.status(200).send();
    } catch (err) {
      console.trace(err);
      res.status(500).send(err);
    }
  }

  public async testNotification(req: Request, res: Response) {
    try {
      let user = req.user!;

      if (user.devices.length > 0) {
        await notifications.sendNotification(user.devices, {
          notification: {
            title: 'Test',
            body: `Hi ${user.name}`
          }
        }, {});
        return res.send(true);
      } else {
        return res.status(400).send({ message: 'user don\'t have devices' });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}