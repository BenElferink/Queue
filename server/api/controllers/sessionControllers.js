import Session from '../models/Session.js';
// more about response status codes   --->   https://restapitutorial.com/httpstatuscodes.html

export const newSession = async (request, response, next) => {
  try {
    let newSession = new Session({});

    response.status(201).json();
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};
