import Pusher from 'pusher';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Session from '../models/Session.js';
import User from '../models/User.js';
import Quest from '../models/Quest.js';

// pusher config
dotenv.config();
const db = mongoose.connection;
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'ap2',
  useTLS: true,
});

// handler
export default () => {
  // watch for changes on all sessions
  const sessionsCollection = db.collection('sessions');
  const changeStream = sessionsCollection.watch();

  changeStream.on('change', async (change) => {
    console.log(change);
    const sessionId = change.documentKey._id;
    let channelName = `session-${sessionId}`;
    let eventName = 'update-session';
    let data = false;

    switch (change.operationType) {
      case 'update':
        const foundSession = await Session.findOne({ _id: sessionId })
          .populate('host users queue history')
          .catch((error) => console.log(error));
        data = {
          message: 'Session updated',
          session: foundSession,
        };
        break;

      case 'delete':
        data = {
          message: 'Session deleted',
          session: {},
        };

      default:
        break;
    }

    if (data) {
      console.log(channelName, eventName, data);
      pusher.trigger(channelName, eventName, data);
    }
  });
};
