import express from 'express';
import { personaRouter } from './routers/persona-router.js';
import { userRouter } from './routers/user-routes.js';
import { adminRouter } from './routers/admin-routes.js';
import cookieParser from 'cookie-parser';

const server = express();
server.set('PORT', process.env.PORT || 3000);

//Motor de plantillas
server.use(express.static('public'));
server.set('views', './views');
server.set('view engine', 'ejs');

server.use(express.json());
server.use(cookieParser());
server.use('/persona', personaRouter);
server.use('/user', userRouter);
server.use('/admin', adminRouter);

server.get('/', (req, res) => {
  res.render('index');
});

server.use((req, res) => {
  res.status(404).send('404 Not Found');
});

server.listen(server.get('PORT'), () => {
  console.log(`Server on port ${server.get('PORT')}`);
});
