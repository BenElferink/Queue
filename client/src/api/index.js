import axios from 'axios';

const url = 'http://localhost:8080/api/v1/session';
const headers = (token) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };
};

export const newSession = async (body) => {
  try {
    const response = await axios.post(`${url}/new`, body);
    console.log(response.status, response.statusText);
    return { token: response.data.token };
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const requestSession = async (sessionId) => {
  try {
    const response = await axios.get(`${url}/${sessionId}`);
    console.log(response.status, response.statusText);
    return { session: response.data.session };
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const newUser = async (sessionId, body) => {
  try {
    const response = await axios.post(`${url}/${sessionId}/login`, body);
    console.log(response.status, response.statusText);
    return { token: response.data.token };
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getSession = async (token) => {
  try {
    const response = await axios.get(url, headers(token));
    console.log(response.status, response.statusText);
    return { session: response.data.session };
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const askQuestion = async (token, body) => {
  try {
    const response = await axios.post(`${url}/quest`, body, headers(token));
    console.log(response.status, response.statusText);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const answerQuestion = async (token, questId, body) => {
  try {
    const response = await axios.put(`${url}/quest/${questId}`, body, headers(token));
    console.log(response.status, response.statusText);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const deleteSession = async (token) => {
  try {
    const response = await axios.put(url, headers(token));
    console.log(response.status, response.statusText);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
