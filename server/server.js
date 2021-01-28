import mongoose from 'mongoose'; // MongoDB (database)
import express from 'express'; // Backend App (server)
import cors from 'cors'; // HTTP headers (enable requests)
import morgan from 'morgan'; // Logs incoming requests
import dotenv from 'dotenv'; // Secures variables
import routes from './api/routes/routes.js';
import { createRequire } from 'module';

// initialize app
const app = express();
const origin = 'http://localhost:3000';

// middlewares
dotenv.config();
app.use(cors({ origin }));
app.use(express.json({ limit: '1mb', extended: false })); // body parser
app.use(express.urlencoded({ limit: '1mb', extended: false })); // url parser
app.use(morgan('common')); // logs requests

// configure db:
const MONGO_URI = process.env.MONGO_URI;
const DEPRECATED_FIX = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };

// connect to db
mongoose
  .connect(MONGO_URI, DEPRECATED_FIX)
  .catch((error) => console.log('❌ MongoDB connection error', error)); // listen for errors on initial connection
mongoose.connection.on('connected', () => console.log('✅ MongoDB connected')); // connected
mongoose.connection.on('disconnected', () => console.log('❌ MongoDB disconnected')); // disconnected
mongoose.connection.on('error', (error) => console.log('❌ MongoDB connection error', error)); // listen for errors during the session

// routes
app.get('/', (request, response, next) => response.status(200).json('Queue'));
app.use('/api/v1', routes);

// server is listening for requests
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`✅ Server is listening on port: ${PORT}`));

// web sockets
const require = createRequire(import.meta.url);
const io = require('socket.io')(server, {
  cors: {
    origin,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('New connection!!');
  socket.on('disconnect', () => {
    console.log('User left..!');
  });
});
