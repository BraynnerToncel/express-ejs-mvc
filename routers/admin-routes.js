import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { configToken } from '../config.js';
import { adminController } from '../controllers/admin.controller.js';

export const adminRouter = Router();

//Verificaion del token
adminRouter.use((req, res, next) => {
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
    next();
  } else {
    if (req.method == 'POST') {
      res.status(401).json({ error: tknValid });
    } else {
      res.status(401).render('noAuthorized');
    }
  }
});

adminRouter.get('/', adminController.admin);
adminRouter.get('/reportes', adminController.reportes);

adminRouter.post('/getUsers', adminController.getUsers);
