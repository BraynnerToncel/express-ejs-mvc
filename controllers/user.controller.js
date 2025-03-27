import { userModel } from '../models/user-model.js';
import { configHash, configToken } from '../config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sesionModel } from '../models/seccion-model.js';

export class userController {
  static createForm(req, res) {
    res.render('user/create');
  }

  static async create(req, res) {
    const { username, password } = req.body;
    const userExist = await userModel.getByName(username);
    if (userExist) {
      if (userExist.rows.length > 0) {
        res.json({ error: 'El usuario ya existe' });
      } else {
        const pwdHash = await bcrypt.hash(password, configHash.SALT_HASH);
        const userNew = await userModel.create(username, pwdHash);
        if (userNew) {
          res.json({ success: 'Usuario registrado correctamente' });
        } else {
          res.status(500).json({ error: 'Error al registrar usuario en DB' });
        }
      }
    } else {
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
    const userExist = await userModel.getByName(username);
    if (userExist) {
      if (userExist.rows.length > 0) {
        const userAuth = await bcrypt.compare(
          password,
          userExist.rows[0].password
        );
        if (userAuth == true) {
          const accessToken = jwt.sign(
            { username: username },
            configToken.SECRET_ACCESS_TOKEN,
            { expiresIn: '30s' }
          );

          const sesionDB = await sesionModel.create(username);
          if (sesionDB) {
            if (sesionDB.rows.length > 0) {
              const refreshToken = jwt.sign(
                { username: username, id_sesion: sesionDB.rows[0].id_sesion },
                configToken.SECRET_REFRESH_TOKEN,
                { expiresIn: '1d' }
              );
              await sesionModel.active(
                sesionDB.rows[0].id_sesion,
                refreshToken
              );
              res.cookie('auth-token', accessToken, { httpOnly: true });
              res.cookie('x-refresh-token', refreshToken, { httpOnly: true });
              res.json({
                success: 'El usuario se autentico correctamente',
                accessToken: accessToken,
              });
            } else {
              res.json({ error: 'Error al registrar tkn de act' });
            }
          } else {
            res.json({ error: 'Error al registrar tkn de act.' });
          }
        } else {
          res.json({ error: 'El usuario o password no son validos.' });
        }
      } else {
        res.json({ error: 'El usuario no es valido.' });
      }
    } else {
      res.status(500).json({ error: 'Error al autenticar usuario' });
    }
  }

  static logout(req, res) {
    res.clearCookie('auth-token');
    res.json({ success: 'Sesión cerrada' });
  }

  static async getList(req, res) {
    res.render('user/list');
  }

  static async refreshToken(req, res) {
    const accessToken = req.cookies['auth-token'];
    const refreshToken = req.cookies['x-refresh-token'];
    let validAccessToken = '';
    let payload;
    try {
      const data = jwt.verify(accessToken, configToken.SECRET_ACCESS_TOKEN);
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        validAccessToken = 'expired';
      } else {
        validAccessToken = 'invalid';
      }
    }
    if (validAccessToken == 'expired') {
      try {
        payload = jwt.verify(refreshToken, configToken.SECRET_REFRESH_TOKEN);
      } catch (e) {
        console.log(e);
      }

      if (payload) {
        const sesionDB = await sesionModel.getById_tkn(
          payload.id_sesion,
          refreshToken
        );
        if (sesionDB) {
          if (sesionDB.rows.length > 0) {
            const tkn = jwt.sign(
              { username: payload.username },
              configToken.SECRET_ACCESS_TOKEN,
              { expiresIn: '30s' }
            );
            res.cookie('auth-token', tkn);
            res.json({ success: 'El token se ha renovado.' });
          } else {
            res.json({ error: 'El token de act. no esta activo.' });
          }
        } else {
          res.json({ error: 'El al verificar token de actualización.' });
        }
      } else {
        res.json({ error: 'El token de act. no es valido' });
      }
    } else {
      res.json({ error: 'El token no es valido' });
    }

    //console.log(accessToken, refreshToken);
  }
}
