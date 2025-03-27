import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { configToken } from '../config.js';
import { adminController } from '../controllers/admin.controller.js';
import verificarAdmin from '../middlewares/authAdmin.js';
import path from 'path';

export const adminRouter = Router();

// Middleware para verificar el token y asignar `req.user`
adminRouter.use((req, res, next) => {
  const tkn = req.cookies['auth-token'];
  if (!tkn) {
    return res.status(401).render('noAuthorized'); // Si no hay token, redirige
  }

  try {
    const payload = jwt.verify(tkn, configToken.SECRET_ACCESS_TOKEN);
    req.user = payload; // Asigna el usuario al request
    next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'expired' });
    }
    return res.status(401).json({ error: 'invalid' });
  }
});

// Rutas de administrador
adminRouter.get('/', adminController.admin);

adminRouter.get('/reportes', verificarAdmin, (req, res) => {
  res.sendFile(path.join(import.meta.dirname, '../views/reportes.html'));
});

adminRouter.post('/getUsers', verificarAdmin, adminController.getUsers);
