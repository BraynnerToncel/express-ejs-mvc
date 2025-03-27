import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.get('/create', userController.createForm);
userRouter.post('/create', userController.create);

userRouter.post('/login', userController.login);
userRouter.post('/logout', userController.logout);

userRouter.get('/list', userController.getList);
userRouter.post('/refreshToken', userController.refreshToken);
