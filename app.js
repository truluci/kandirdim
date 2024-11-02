import express from 'express';
import mongoose from 'mongoose';
import indexRouter from './routers/index.js';
import setupSocketIO from './utils/setupSocketIO.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kandirdim';

await mongoose.connect(MONGODB_URI);

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());

app.use('/', indexRouter);

const server = app.listen(PORT);

console.log(`> http://localhost:${PORT}`);

setupSocketIO(server);
