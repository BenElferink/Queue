import Session from '../models/Session.js';
import User from '../models/User.js';
import Quest from '../models/Quest.js';
import { generateToken } from '../middleware/jsonWebToken.js';
// more about response status codes   --->   https://restapitutorial.com/httpstatuscodes.html

export const newSession = async (request, response, next) => {
  try {
    // create host, and save it
    const newHost = new User({ username: request.body.username });
    await newHost.save();

    // create session, and save it
    const newSession = new Session({
      host: newHost._id,
    });
    await newSession.save();

    // create host token, and populate session
    const hostToken = generateToken({ session: newSession._id, id: newHost._id, role: 'host' });

    response.status(201).json({ message: 'Session created', token: hostToken });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const requestSession = async (request, response, next) => {
  try {
    // find the session, filter data for public view
    const foundSession = await Session.findOne({ _id: request.params.id })
      .select('_id host')
      .populate('host');
    if (!foundSession) return response.status(404).json({ message: 'Session not found' });

    response.status(200).json({ message: 'Session found', session: foundSession });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const newUser = async (request, response, next) => {
  try {
    // find the session
    const foundSession = await Session.findOne({ _id: request.params.id });
    if (!foundSession) return response.status(404).json({ message: 'Session not found' });

    // create host, and save it
    const newUser = new User({ username: request.body.username });
    await newUser.save();

    // add the new user to session
    foundSession.users.push(newUser._id);
    await foundSession.save();

    // create user token, and populate session
    const userToken = generateToken({ session: foundSession._id, id: newUser._id, role: 'user' });

    response.status(201).json({ message: 'Welcome to the session', token: userToken });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getSession = async (request, response, next) => {
  try {
    // find the session, filter data for public view
    const foundSession = await Session.findOne({ _id: request.sessionId }).populate(
      'host users queue history',
    );
    if (!foundSession) return response.status(404).json({ message: 'Session not found' });

    response.status(200).json({ message: 'Session found', session: foundSession });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const askQuestion = async (request, response, next) => {
  try {
    // find session
    const foundSession = await Session.findOne({ _id: request.sessionId });
    if (!foundSession) return response.status(404).json({ message: 'Session not found' });

    // create new quest, and save it
    const newQuest = new Quest({
      from: request.userId,
      question: request.body.question,
    });
    await newQuest.save();

    // add quest to session
    foundSession.queue.push(newQuest._id);
    await foundSession.save();

    response.status(201).json({ message: 'Quest sent' });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const answerQuestion = async (request, response, next) => {
  try {
    // find session
    const foundSession = await Session.findOne({ _id: request.sessionId });
    if (!foundSession) return response.status(404).json({ message: 'Session not found' });

    // find question, answer it, and save
    const foundQuestion = await Quest.findOne({ _id: request.params.id });
    if (!foundQuestion) return response.status(404).json({ message: 'Question not found' });
    foundQuestion.answer = request.body.answer;
    await foundQuestion.save();

    // remove quest from queue, and add to history
    const newQueue = foundSession.queue.filter((quest) => !quest.equals(request.params.id));
    foundSession.queue = newQueue;
    foundSession.history.push(request.params.id);
    await foundSession.save();

    response.status(200).json({ message: 'Quest updated' });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const deleteSession = async (request, response, next) => {
  try {
    // verify request is from host
    if (request.role !== 'host')
      return response.status(401).json({ message: 'Unauthorized to delete session' });

    // find session
    const foundSession = await Session.findOne({ _id: request.sessionId });
    if (!foundSession) return response.status(404).json({ message: 'Session not found' });

    // then target all it's contents and delete them from DB
    foundSession.history.map(async (quest) => await Quest.deleteOne({ _id: quest }));
    foundSession.queue.map(async (quest) => await Quest.deleteOne({ _id: quest }));
    foundSession.users.map(async (user) => await User.deleteOne({ _id: user }));
    await User.deleteOne({ _id: foundSession.host });
    await Session.deleteOne({ _id: request.sessionId });

    response.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};
