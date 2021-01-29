import Room from '../models/Room.js';
import Person from '../models/Person.js';
import Quest from '../models/Quest.js';
import { generateToken, authenticateToken_v2 } from '../middleware/jsonWebToken.js';
// more about response status codes   --->   https://restapitutorial.com/httpstatuscodes.html

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

  console.log(response);
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
      response.isError = { error: 'room not found', id: roomId };
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

  console.log(response);
  return response;
};

export const askQuestion = async ({ token, question }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken_v2(token);

    if (tokenError) {
      response.isError = { error: tokenError };
    } else {
      // find session
      const foundRoom = await Room.findOne({ _id: tokenData.roomId });
      if (!foundRoom) {
        response.isError = { error: 'room not found', id: tokenData.roomId };
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

  console.log(response);
  return response;
};

export const answerQuestion = async ({ token, questId, answer }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken_v2(token);
    if (tokenError) {
      response.isError = { error: tokenError };
    } else {
      // find question, answer it, and save
      const foundQuestion = await Quest.findOne({ _id: questId });
      if (!foundQuestion) {
        response.isError = {
          error: 'question not found',
          id: questId,
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

  console.log(response);
  return response;
};

export const getRoom = async ({ token }) => {
  let response = {
    data: {},
    isError: false,
  };

  try {
    const { tokenError, tokenData } = authenticateToken_v2(token);
    if (tokenError) {
      response.isError = { error: tokenError };
    } else {
      // find the session, filter data for public view
      const foundRoom = await Room.findOne({ _id: tokenData.roomId }).populate({
        path: 'queue',
        populate: { path: 'from' },
      });
      if (!foundRoom) {
        response.isError = { error: 'room not found', id: tokenData.roomId };
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

  console.log(response);
  return response;
};
