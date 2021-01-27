import mongoose from 'mongoose'; // MongoDB (database)
import express from 'express'; // Backend App (server)
import cors from 'cors'; // HTTP headers (enable requests)
import morgan from 'morgan'; // Logs incoming requests
import dotenv from 'dotenv'; // Secures variables
import routes from './api/routes/routes.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const socket = require('socket.io'); // web sockets (real-time)

// initialize app
const app = express();

// middlewares
app.use(express.json({ limit: '1mb', extended: false })); // body parser
app.use(express.urlencoded({ limit: '1mb', extended: false })); // url parser
app.use(cors());
app.use(morgan('common')); // logs requests
dotenv.config();

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
const io = socket(server);
io.on('connection', (user) => {
  console.log('Socket opened', user);
});
