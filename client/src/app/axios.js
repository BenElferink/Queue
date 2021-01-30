import axios from 'axios';

const url = 'https://queue-and-a.herokuapp.com/api/v2';
// const url = 'http://localhost:4000/api/v2';

// const headers = (token) => {
//   return {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Bearer ' + token,
//     },
//   };
// };

export const requestRoom = async (sessionId) => {
  try {
    const response = await axios.get(`${url}/room/${sessionId}`);
    console.log(response.status, response.statusText, response.data.message);
    return { roomId: response.data.roomId, host: response.data.host };
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
