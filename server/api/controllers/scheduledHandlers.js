import Room from '../models/Room.js';
import Person from '../models/Person.js';
import Quest from '../models/Quest.js';

export const cleanExpiredData = async () => {
  try {
    // find all rooms
    const allRooms = await Room.find();
    // then identify all rooms over 12h since creation
    allRooms.map(async (room) => {
      if (Date.now() - new Date(room.createdAt) >= 4.32e7) {
        // and target all it's contents to delete them from DB
        room.queue.map(async (questId) => await Quest.deleteOne({ _id: questId }));
        room.guests.map(async (userId) => await Person.deleteOne({ _id: userId }));
        await Person.deleteOne({ _id: room.host });
        await Room.deleteOne({ _id: room._id });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
