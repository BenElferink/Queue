import mongoose from 'mongoose'; // MongoDB (database)
import express from 'express'; // Backend App (server)
import cors from 'cors'; // HTTP headers (enable requests)
import morgan from 'morgan'; // Logs incoming requests
import dotenv from 'dotenv'; // Secures variables
import routesV2 from './api/routes/httpRoutes.js';
import {
  createRoom,
  joinRoom,
  askQuestion,
  answerQuestion,
  getRoom,
} from './api/controllers/socketHandlers.js';
import { createRequire } from 'module';

// initialize app
const app = express();
const origin = 'https://belferink1996.github.io/MERN-Queue';
// const origin = 'http://localhost:3000';

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
const server = app.listen(PORT, () => console.log(`✅ Server is listening on port: ${PORT}`));

// web sockets
const require = createRequire(import.meta.url);
const io = require('socket.io')(server, {
  cors: {
    origin,
    methods: ['GET', 'POST'],
  },
});

// socket connection
io.on('connection', (socket) => {
  const ID = socket.id;
  console.log(`New connection! ${ID}`);

  // refetch the room - { token }
  socket.on('refetch', async (body, cb) => {
    const { isError, data } = await getRoom(body);
    if (isError) return cb(isError);

    socket.join(JSON.stringify(data.roomId));
    socket.emit('refetched', data);
    cb();
  });

  // create a room - { username }
  socket.on('create', async (body, cb) => {
    const { isError, data } = await createRoom(body);
    if (isError) return cb(isError);

    socket.join(JSON.stringify(data.roomId));
    socket.emit('created', data);
    cb();
  });

  // join a room - { roomId, username }
  socket.on('join', async (body, callback) => {
    const { isError, data } = await joinRoom(body);
    if (isError) return cb(isError);

    socket.join(JSON.stringify(data.roomId));
    socket.emit('joined', data);
    callback();
  });

  // ask a question - { token, question }
  socket.on('ask', async (body, callback) => {
    const { isError, data } = await askQuestion(body);
    if (isError) return cb(isError);

    io.to(JSON.stringify(data.roomId)).emit('asked', data);
    callback();
  });

  // answer a question - { token, questId, answer }
  socket.on('answer', async (body, callback) => {
    const { isError, data } = await answerQuestion(body);
    if (isError) return cb(isError);

    io.to(JSON.stringify(data.roomId)).emit('answered', data);
    callback();
  });

  socket.on('disconnecting', () => {
    console.log(`Disconnecting... ${ID}`);
    console.log('Rooms:', socket.rooms);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected! ${ID}`);
  });
});
