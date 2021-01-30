import Room from '../models/Room.js';
import Person from '../models/Person.js';
import Quest from '../models/Quest.js';
import { generateToken, authenticateToken_socket } from '../middleware/jsonWebToken.js';

export const createRoom = async ({ username }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    // create host, and save it
    const newHost = new Person({ username });
    await newHost.save();

    // create session, and save it
    const newRoom = new Room({ host: newHost._id });
    await newRoom.save();

    // create host token
    const token = generateToken({
      roomId: newRoom._id,
      userId: newHost._id,
      username: newHost.username,
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
  return response;
};

export const joinRoom = async ({ roomId, username }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    // find the room
    const foundRoom = await Room.findOne({ _id: roomId });
    if (!foundRoom) {
      response.isError = {
        error: 'room not found',
        roomId,
      };
    } else {
      // create user, and save it
      const newGuest = new Person({ username });
      await newGuest.save();

      // add the new user to room
      foundRoom.guests.push(newGuest._id);
      await foundRoom.save();

      // populate queue
      await Room.populate(foundRoom, {
        path: 'queue',
        populate: { path: 'from' },
      });

      // create user token
      const token = generateToken({
        roomId: foundRoom._id,
        userId: newGuest._id,
        username: newGuest.username,
        role: 'user',
      });

      response.data = {
        message: 'joined room',
        roomId: foundRoom._id,
        queue: foundRoom.queue,
        token,
      };
    }
  } catch (error) {
    response.isError = { error };
  }
  return response;
};

export const getRoom = async ({ token }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken_socket(token);
    if (tokenError) {
      response.isError = {
        error: tokenError,
      };
    } else {
      // find the session, filter data for public view
      const foundRoom = await Room.findOne({ _id: tokenData.roomId }).populate({
        path: 'queue',
        populate: { path: 'from' },
      });
      if (!foundRoom) {
        response.isError = {
          error: 'room not found',
          roomId: tokenData.roomId,
        };
      } else {
        response.data = {
          message: 'room fetched',
          roomId: foundRoom._id,
          queue: foundRoom.queue,
        };
      }
    }
  } catch (error) {
    response.isError = { error };
  }
  return response;
};

export const askQuestion = async ({ token, question }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken_socket(token);
    if (tokenError) {
      response.isError = {
        error: tokenError,
      };
    } else {
      // find session
      const foundRoom = await Room.findOne({ _id: tokenData.roomId });
      if (!foundRoom) {
        response.isError = {
          error: 'room not found',
          roomId: tokenData.roomId,
        };
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
        await Quest.populate(newQuest, 'from');

        console.log(newQuest);
        response.data = {
          message: 'question asked',
          roomId: tokenData.roomId,
          quest: newQuest,
        };
      }
    }
  } catch (error) {
    response.isError = { error };
  }

  return response;
};

export const answerQuestion = async ({ token, questId, answer }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken_socket(token);
    if (tokenError) {
      response.isError = {
        error: tokenError,
      };
    } else {
      // find question, answer it, and save
      const foundQuestion = await Quest.findOne({ _id: questId });
      if (!foundQuestion) {
        response.isError = {
          error: 'question not found',
          questId,
        };
      } else {
        foundQuestion.answer = answer;
        foundQuestion.answered = true;
        await foundQuestion.save();

        // populate quest
        await Quest.populate(foundQuestion, 'from');

        response.data = {
          message: 'question asnwered',
          roomId: tokenData.roomId,
          quest: foundQuestion,
        };
      }
    }
  } catch (error) {
    response.isError = { error };
  }
  return response;
};

export const deleteRoom = async ({ token }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken_socket(token);
    if (tokenError) {
      response.isError = { error: tokenError };
    } else {
      // verify that the request is from host
      if (tokenData.role !== 'host') {
        response.isError = {
          error: 'unauthorized to delete session',
        };
      } else {
        // find session
        const foundRoom = await Room.findOne({ _id: tokenData.roomId });
        if (!foundRoom) {
          response.isError = {
            error: 'room not found',
            roomId: tokenData.roomId,
          };
        } else {
          // then target all it's contents and delete them from DB
          foundRoom.queue.map(async (questId) => await Quest.deleteOne({ _id: questId }));
          foundRoom.guests.map(async (userId) => await Person.deleteOne({ _id: userId }));
          await Person.deleteOne({ _id: foundRoom.host });
          await Room.deleteOne({ _id: tokenData.roomId });

          response.data = {
            message: 'room deleted',
            roomId: tokenData.roomId,
          };
        }
      }
    }
  } catch (error) {
    response.isError = { error };
  }
  return response;
};

export const deleteQuestion = async ({ token, questId }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken_socket(token);
    if (tokenError) {
      response.isError = { error: tokenError };
    } else {
      const foundRoom = await Room.findOne({ _id: tokenData.roomId });
      if (!foundRoom) {
        response.isError = {
          error: 'room not found',
          roomId: tokenData.roomId,
        };
      } else {
        // find the question
        const foundQuest = await Quest.findOne({ _id: questId });
        if (!foundQuest) {
          response.isError = {
            error: 'question not found',
            questId,
          };
        } else {
          // verify that the request is from the quest-creator,
          // or from the room-host (and question is from the hosts room)
          if (
            tokenData.userId.equals(foundQuest.from) ||
            (tokenData.userId.equals(foundRoom.host) && foundRoom.queue.includes(questId))
          ) {
            await Quest.deleteOne({ _id: questId });

            response.data = {
              message: 'question deleted',
              roomId: tokenData.roomId,
              questId,
            };
          } else {
            response.isError = {
              error: 'unauthorized to delete question',
              roomId: tokenData.roomId,
              id: questId,
            };
          }
        }
      }
    }
  } catch (error) {
    response.isError = { error };
  }
  return response;
};
