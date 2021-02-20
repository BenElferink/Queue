import mongoose from 'mongoose'; // MongoDB (database)
import express from 'express'; // Backend App (server)
import cors from 'cors'; // HTTP headers (enable requests)
import morgan from 'morgan'; // Logs incoming requests
import dotenv from 'dotenv'; // Secures variables
import cron from 'node-cron'; // Scheduled tasks
// import wakeDyno from 'woke-dyno'; // Keep Heroku dynos awake
import { createRequire } from 'module'; // use require()
import routesV2 from './api/routes/httpRoutes.js';
import sockets from './api/routes/sockets.js';
import { cleanExpiredData } from './api/controllers/scheduledHandlers.js';

// initialize app
const app = express();
const origin = '*';

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

const db = mongoose.connection;
db.on('connected', () => console.log('✅ MongoDB connected')); // connected
db.on('disconnected', () => console.log('❌ MongoDB disconnected')); // disconnected
db.on('error', (error) => console.log('❌ MongoDB connection error', error)); // listen for errors during the session

// routes
app.get('/', (request, response, next) => response.status(200).json('Queue'));
app.use('/api/v2', routesV2);

// server is listening for requests
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server is listening on port: ${PORT}`);
  // wakeDyno('https://queue-client.herokuapp.com').start();
  // wakeDyno('https://queue-and-a.herokuapp.com').start();
});

// web sockets
const require = createRequire(import.meta.url);
export const io = require('socket.io')(server, { cors: { origin } });
io.on('connection', sockets);

// scheduled task, every hour
cron.schedule('0 * * * *', cleanExpiredData);
