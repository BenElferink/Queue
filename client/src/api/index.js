import axios from 'axios';

// api base-url (that you created on server side)
const url = 'http://localhost:8080';
const headers = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };
};

export const newSession = async (body) => {
  try {
    const response = await axios.post(`${url}/session/new`, body);
    console.log(response.status, response.statusText);
    localStorage.setItem('token', response.data.yourToken);
    return response.data.session;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// const deleteSession = async (id) => {
//   try {
//     const response = await axios.delete(`${url}/session/${id}`, headers());
//     console.log(response.status, response.statusText);
//     return true
//   } catch (error) {
//     console.log(error.message);
//     return false
//   }
// }

// const moveToHistory = async (id, qid) => {
//   try {
//     const response = await axios.delete(`${url}/session/${id}/quest/${qid}`, headers());
//     console.log(response.status, response.statusText);
//     return true
//   } catch (error) {
//     console.log(error.message);
//     return false
//   }
// }

// // user routes
// axios.get('/session/:id', requestSession);
// axios.post('/session/:id/login', newUser);
// axios.post('/session/:id/quest', authenticateToken, addToQueue);
