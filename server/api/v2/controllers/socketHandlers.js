import Room from '../models/Room.js';
import User from '../models/User.js';
import Quest from '../models/Quest.js';
import { authenticateToken, generateToken } from '../middleware/jsonWebToken.js';
// more about response status codes   --->   https://restapitutorial.com/httpstatuscodes.html

export const createRoom = async ({ username }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    // create host, and save it
    const newHost = new User({ username });
    await newHost.save();

    // create session, and save it
    const newRoom = new Room({ host: newHost._id });
    await newRoom.save();

    // create host token
    const token = generateToken({
      roomId: newRoom._id,
      userId: newHost._id,
      role: 'host',
    });

    response.data = {
      message: 'created room',
      roomId: newRoom._id,
      token,
    };
  } catch (error) {
    response.isError = { error };
  }

  console.log(response);
  return response;
};

export const joinRoom = async ({ sessionId, username }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    // find the session
    const foundRoom = await Room.findOne({ _id: sessionId });
    if (!foundRoom) {
      response.isError = { error: 'room not found' };
    } else {
      // create user, and save it
      const newUser = new User({ username });
      await newUser.save();

      // add the new user to session
      foundRoom.users.push(newUser._id);
      await foundRoom.save();

      // populate queue
      Room.populate(
        foundRoom,
        {
          path: 'queue',
          populate: { path: 'from' },
        },
        (err, doc) => {
          if (err) {
            isError = { error: err };
          } else {
            // create user token
            const token = generateToken({
              roomId: foundRoom._id,
              userId: newUser._id,
              role: 'user',
            });

            response.data = {
              message: 'joined room',
              roomId: foundRoom._id,
              queue: doc.queue,
              token,
            };
          }
        },
      );
    }
  } catch (error) {
    response.isError = { error };
  }

  console.log(response);
  return response;
};

export const askQuestion = async ({ token, question }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken(token);
    if (tokenError) {
      response.isError = { error: tokenError };
    } else {
      // find session
      const foundRoom = await Room.findOne({ _id: tokenData.roomId });
      if (!foundRoom) {
        response.isError = { error: 'room not found' };
      } else {
        // create new quest, and save it
        const newQuest = new Quest({
          from: tokenData.userId,
          question,
        });
        await newQuest.save();

        // add quest to session
        foundRoom.queue.push(newQuest._id);
        await foundRoom.save();

        // populate quest
        Quest.populate(newQuest, { path: 'from' }, (err, doc) => {
          if (err) {
            response.isError = { error: err };
          } else {
            response.data = {
              message: 'question asked',
              roomId: tokenData.roomId,
              quest: doc,
            };
          }
        });
      }
    }
  } catch (error) {
    response.isError = { error };
  }

  console.log(response);
  return response;
};

export const answerQuestion = async ({ token, questId, answer }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken(token);
    if (tokenError) {
      response.isError = { error: tokenError };
    } else {
      // find question, answer it, and save
      const foundQuestion = await Quest.findOne({ _id: questId });
      if (!foundQuestion) {
        response.isError = {
          error: 'question not found',
        };
      } else {
        foundQuestion.answer = answer;
        foundQuestion.answered = true;
        await foundQuestion.save();

        // populate quest
        Quest.populate(foundQuestion, { path: 'from' }, (err, doc) => {
          if (err) {
            response.isError = { error: err };
          } else {
            response.data = {
              message: 'question asnwered',
              roomId: tokenData.roomId,
              quest: doc,
            };
          }
        });
      }
    }
  } catch (error) {
    response.isError = { error };
  }

  console.log(response);
  return response;
};

// export const requestRoom = async (request, response, next) => {
//   try {
//     // find the session, filter data for public view
//     const foundRoom = await Room.findOne({ _id: request.params.id })
//       .select('_id host')
//       .populate('host');
//     if (!foundRoom)
//       return response.status(404).json({
//         message: 'Room not found',
//       });

//     response.status(200).json({
//       message: 'Room requested',
//       session: foundRoom,
//     });
//   } catch (error) {
//     console.log(error);
//     response.status(500).json(error);
//   }
// };

// const getRoom = async (id) => {
//   try {
//     // find and populate session
//     const foundRoom = await Room.findOne({ _id: id }).populate(
//       'host users queue history',
//     );
//     if (!foundRoom)
//       return response.status(404).json({
//         message: 'Room not found',
//       });

//     response.status(200).json({
//       message: 'Room fetched',
//       session: foundRoom,
//     });
//   } catch (error) {
//     console.log(error);
//     response.status(500).json(error);
//   }
// };

export const deleteRoom = async (request, response, next) => {
  try {
    // verify request is from host
    if (request.role !== 'host')
      return response.status(401).json({
        message: 'Unauthorized to delete session',
      });

    // find session
    const foundRoom = await Room.findOne({ _id: request.sessionId });
    if (!foundRoom)
      return response.status(404).json({
        message: 'Room not found',
      });

    // then target all it's contents and delete them from DB
    foundRoom.history.map(async (quest) => await Quest.deleteOne({ _id: quest }));
    foundRoom.queue.map(async (quest) => await Quest.deleteOne({ _id: quest }));
    foundRoom.users.map(async (user) => await User.deleteOne({ _id: user }));
    await User.deleteOne({ _id: foundRoom.host });
    await Room.deleteOne({ _id: request.sessionId });

    response.status(200).json({
      message: 'Room deleted',
    });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};
