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
