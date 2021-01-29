const initialState = {
  token: localStorage.getItem('token') || '',
  isLogged: false,
  userId: null,
  username: null,
  role: null,
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
        userId: parsedData.userId,
        role: parsedData.role,
        username: parsedData.username,
        isLogged: true,
      };

    case 'REFETCHED':
      const copiedToken = state.token;
      const fromToken = JSON.parse(window.atob(copiedToken.split('.')[1]));
      localStorage.setItem('token', copiedToken);
      return {
        token: copiedToken,
        userId: fromToken.userId,
        role: fromToken.role,
        username: fromToken.username,
        isLogged: true,
      };

    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        token: '',
        isLogged: false,
        userId: null,
        username: null,
        role: null,
      };

    default:
      return state;
  }
};
