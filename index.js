import express from 'express';
import { personaRouter } from './routers/persona-router.js';

const server = express();
server.set('PORT', process.env.PORT || 3000);

//Motor de plantillas
server.set('views', './views');
server.set('view engine', 'ejs');

server.use(express.json());

server.use('/persona', personaRouter);

server.get('/', (req, res) => {
  res.render('index');
});

server.use((req, res) => {
  res.status(404).send('404 Not Found');
});

server.listen(server.get('PORT'), () => {
  console.log(`Server on port ${server.get('PORT')}`);
});
