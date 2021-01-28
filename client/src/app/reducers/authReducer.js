const initialState = {
  token: localStorage.getItem('token') || '',
  id: null,
  role: null,
  username: null,
  isLogged: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_ROOM':
    case 'JOIN_ROOM':
      const token = action.payload.token;
      // this extracts the data from inside the token
      const parsedData = JSON.parse(window.atob(token.split('.')[1]));
      localStorage.setItem('token', token);
      return {
        token,
        id: parsedData.userId,
        role: parsedData.role,
        username: parsedData.username,
        isLogged: true,
      };

    case 'LOGOUT':
      localStorage.removeItem('token');
      return initialState;

    default:
      return state;
  }
};
