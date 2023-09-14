import express from 'express';
import dotenv from 'dotenv';
import router from './routers/Todo.routes.js';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api', router);

app.listen(port, ()=>{
    console.log(`Servidor corriendo como nunca - ${port}`);
})