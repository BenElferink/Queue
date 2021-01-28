import Room from '../models/Room.js';
import User from '../models/User.js';
import Quest from '../models/Quest.js';
// more about response status codes   --->   https://restapitutorial.com/httpstatuscodes.html

export const requestRoom = async (request, response, next) => {
  const roomId = request.params.id;
  try {
    // find the session, filter data for public view
    const foundRoom = await Room.findOne({ _id: roomId }).select('_id host').populate('host');
    if (!foundRoom) {
      response.status(404).json({
        message: 'room not found',
        id: roomId,
      });
    } else {
      response.status(200).json({
        message: 'room requested',
        roomId: foundRoom._id,
        host: foundRoom.host,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const deleteRoom = async (request, response, next) => {
  try {
    // verify request is from host
    if (request.role !== 'host') {
      response.status(401).json({
        message: 'unauthorized to delete session',
      });
    } else {
      // find session
      const foundRoom = await Room.findOne({ _id: request.roomId });
      if (!foundRoom) {
        response.status(404).json({
          message: 'room not found',
          id: request.roomId,
        });
      } else {
        // then target all it's contents and delete them from DB
        foundRoom.queue.map(async (questId) => await Quest.deleteOne({ _id: questId }));
        foundRoom.users.map(async (userId) => await User.deleteOne({ _id: userId }));
        await User.deleteOne({ _id: foundRoom.host });
        await Room.deleteOne({ _id: request.roomId });

        response.status(200).json({
          message: 'room deleted',
        });
      }
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};
