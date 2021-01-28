const initialState = {
  id: null,
  host: {},
  queue: [],
};

export const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_ROOM':
    case 'REQUEST_ROOM':
    case 'JOIN_ROOM':
      return {
        ...state,
        id: action.payload.roomId,
        host: action.payload.host,
        queue: action.payload.queue,
      };

    case 'ASK_QUEST':
      return { ...state, queue: [...state.queue, action.payload.queue] };

    case 'ANSWER_QUEST':
      return {
        ...state,
        queue: [
          state.queue.filter((quest) => quest._id !== action.payload.queue._id),
          action.payload.queue,
        ],
      };

    case 'LOGOUT':
      return initialState;

    default:
      return state;
  }
};
