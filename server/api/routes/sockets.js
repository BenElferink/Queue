import { io } from '../../index.js';
import {
  createRoom,
  joinRoom,
  askQuestion,
  answerQuestion,
  getRoom,
  deleteQuestion,
  deleteRoom,
} from '../controllers/socketHandlers.js';

export default (socket) => {
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

  // refetch the room - { token }
  socket.on('refetch', async (body, cb) => {
    const { isError, data } = await getRoom(body);
    if (isError) return cb(isError);
    socket.join(JSON.stringify(data.roomId));
    socket.emit('refetched', data);
    cb();
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

  // delete a question - { token, questId }
  socket.on('delete-quest', async (body, cb) => {
    const { isError, data } = await deleteQuestion(body);
    if (isError) return cb(isError);
    io.to(JSON.stringify(data.roomId)).emit('deleted-quest', data);
    cb();
  });

  // delete the room - { token }
  socket.on('delete-room', async (body, cb) => {
    const { isError, data } = await deleteRoom(body);
    if (isError) return cb(isError);
    io.to(JSON.stringify(data.roomId)).emit('deleted-room', data);
    cb();
  });

  socket.on('disconnecting', () => {});
  socket.on('disconnect', () => {});
};
