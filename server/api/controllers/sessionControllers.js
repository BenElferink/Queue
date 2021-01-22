import Session from '../models/Session.js';
import User from './../models/User.js';
import Quest from './../models/Quest.js';
import { generateToken } from './../middleware/jsonWebToken.js';
// more about response status codes   --->   https://restapitutorial.com/httpstatuscodes.html

export const newSession = async (request, response, next) => {
  try {
    // create host, save it, and generate a token (required for handling session).
    const newHost = new User({ username: request.body.username });
    const savedHost = await newHost.save();
    const hostToken = generateToken(savedHost._id);

    // create session, and save it
    const newSession = new Session({
      host: savedHost._id,
    });
    const savedSession = await newSession.save();

    response
      .status(201)
      .json({ message: 'Session created', sessionId: savedSession._id, yourToken: hostToken });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getSession = async (request, response, next) => {
  try {
    const foundSession = await Session.findOne({ _id: request.params.id })
      .select('_id host')
      .populate('host');

    response.status(201).json({ message: 'Session found', session: foundSession });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};
