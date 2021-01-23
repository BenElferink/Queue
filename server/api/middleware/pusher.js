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
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// handler
export default () => {
  // watch for changes on all sessions
  const sessionsCollection = db.collection('sessions');
  const changeStream = sessionsCollection.watch();

  changeStream.on('change', async (change) => {
    console.log(change);

    // updated session data
    if (change.operationType === 'update') {
      try {
        // find and populate session
        const sessionId = change.documentKey._id;
        const foundSession = await Session.findOne({ _id: sessionId }).populate(
          'host users queue history',
        );

        // trigger pusher:
        // channel name is 'session-ID'
        // event is 'sync'
        pusher.trigger(`session-${sessionId}`, 'sync', {
          message: 'Session data updated',
          session: foundSession,
        });
      } catch (error) {
        console.log(error);
      }

      // deleted session
    } else if (change.operationType === 'delete') {
      // trigger pusher:
      // channel name is 'session-ID'
      // event is 'delete'
      pusher.trigger(`session-${change.documentKey._id}`, 'delete', {
        message: 'Session deleted',
      });
    }
  });
};
