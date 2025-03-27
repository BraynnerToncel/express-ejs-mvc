import jwt from 'jsonwebtoken';
import { configToken } from '../config.js';
import { userModel } from '../models/user-model.js';

export class adminController {
  static admin(req, res) {
    const tkn = req.cookies['auth-token'];
    let payload = null;
    let tknValid = null;
    try {
      payload = jwt.verify(tkn, configToken.SECRET_ACCESS_TOKEN);
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        tknValid = 'expired';
      } else {
        tknValid = 'invalid';
      }
    }

    if (payload) {
      res.render('admin/admin');
    } else {
      res.render('noAuthorized');
    }
  }

  static reportes(req, res) {
    res.render('admin/reportes');
  }

  static async getUsers(req, res) {
    const data = await userModel.getUsers();
    if (data) {
      res.json({ success: 'OK', data: data.rows });
    } else {
      res.json({ error: 'Ocurrió un error' });
    }
  }
}
