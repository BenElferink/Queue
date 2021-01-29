import Room from '../models/Room.js';
import Person from '../models/Person.js';
import Quest from '../models/Quest.js';
// more about response status codes   --->   https://restapitutorial.com/httpstatuscodes.html

export const requestRoom = async (request, response, next) => {
  const roomId = request.params.id;
  try {
    // find the session, filter data for public view
    const foundRoom = await Room.findOne({ _id: roomId }).select('_id host').populate('host');
    if (!foundRoom) {
      const data = {
        message: 'room not found',
        id: roomId,
      };
      console.log(data);
      response.status(404).json(data);
    } else {
      const data = {
        message: 'room requested',
        roomId: foundRoom._id,
        host: foundRoom.host,
      };
      console.log(data);
      response.status(200).json(data);
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
      const data = {
        message: 'unauthorized to delete session',
      };
      console.log(data);
      response.status(401).json(data);
    } else {
      // find session
      const foundRoom = await Room.findOne({ _id: request.roomId });
      if (!foundRoom) {
        const data = {
          message: 'room not found',
          id: request.roomId,
        };
        console.log(data);
        response.status(404).json(data);
      } else {
        // then target all it's contents and delete them from DB
        foundRoom.queue.map(async (questId) => await Quest.deleteOne({ _id: questId }));
        foundRoom.guests.map(async (userId) => await Person.deleteOne({ _id: userId }));
        await Person.deleteOne({ _id: foundRoom.host });
        await Room.deleteOne({ _id: request.roomId });

        const data = {
          message: 'room deleted',
        };
        console.log(data);
        response.status(200).json(data);
      }
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};
