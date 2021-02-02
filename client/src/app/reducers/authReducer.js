const initialState = {
  token: localStorage.getItem('token') || '',
  username: null,
  userId: null,
  role: null,
  isLogged: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_ROOM':
    case 'JOIN_ROOM':
      const token = action.payload.token;
      const parsedData = JSON.parse(window.atob(token.split('.')[1]));
      localStorage.setItem('token', token);
      return {
        token,
        username: parsedData.username,
        userId: parsedData.userId,
        role: parsedData.role,
        isLogged: true,
      };

    case 'REFETCHED':
      const copiedToken = state.token;
      const fromToken = JSON.parse(window.atob(copiedToken.split('.')[1]));
      localStorage.setItem('token', copiedToken);
      return {
        token: copiedToken,
        username: fromToken.username,
        userId: fromToken.userId,
        role: fromToken.role,
        isLogged: true,
      };

    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        token: '',
        username: null,
        userId: null,
        role: null,
        isLogged: false,
      };

    default:
      return state;
  }
};
