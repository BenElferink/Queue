import mongoose from 'mongoose'; // MongoDB (database)
import express from 'express'; // Backend App (server)
import cors from 'cors'; // HTTP headers (enable requests)
import morgan from 'morgan'; // Logs incoming requests
import dotenv from 'dotenv'; // Secures variables
import routesV1 from './api/v1/routes/routes.js';
// import routesV2 from './api/v2/routes/httpRoutes.js';
import { createRoom, joinRoom, askQuestion } from './api/v2/controllers/socketHandlers.js';
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

const db = mongoose.connection;
db.on('connected', () => console.log('✅ MongoDB connected')); // connected
db.on('disconnected', () => console.log('❌ MongoDB disconnected')); // disconnected
db.on('error', (error) => console.log('❌ MongoDB connection error', error)); // listen for errors during the session

// routes
app.get('/', (request, response, next) => response.status(200).json('Queue'));
app.use('/api/v1', routesV1);
// app.use('/api/v2', routesV2);

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
  console.log('New connection!!');

  // create a room - { username }
  socket.on('create', (body, cb) => {
    const { isError, data } = createRoom(body);
    if (isError) return cb(isError);

    socket.emit('created', data);
    socket.join(data.roomId);
    cb();
  });

  // join a room - { roomId, username }
  socket.on('join', (body, callback) => {
    const { isError, data } = joinRoom(body);
    if (isError) return cb(isError);

    socket.emit('joined', data);
    // socket.broadcast.to(data.roomId).emit('joined', {});
    socket.join(data.roomId);
    callback();
  });

  // ask a question - { token, question }
  socket.on('ask', (body, callback) => {
    const { isError, data } = askQuestion(body);
    if (isError) return cb(isError);

    io.to(data.roomId).emit('asked', data);
    callback();
  });

  // answer a question - { token, questId, answer }
  socket.on('answer', (body, callback) => {
    const { isError, data } = asnwerQuestion(body);
    if (isError) return cb(isError);

    io.to(data.roomId).emit('answered', data);
    callback();
  });

  // emit 'disconnect'
  socket.on('disconnect', () => {
    console.log('User left..!');
  });
});
