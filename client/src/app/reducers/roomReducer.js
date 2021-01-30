const initialState = {
  roomId: null,
  queue: [],
  history: [],
};

export const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_ROOM':
      console.log(`🔐 Session ID: ${action.payload.roomId}`);
      return {
        ...state,
        roomId: action.payload.roomId,
      };

    case 'JOIN_ROOM':
    case 'REFETCHED':
      return {
        roomId: action.payload.roomId,
        queue: action.payload.queue.filter((quest) => !quest.answered),
        history: action.payload.queue.filter((quest) => quest.answered),
      };

    case 'ASK_QUEST':
      return { ...state, queue: [...state.queue, action.payload.quest] };

    case 'ANSWER_QUEST':
      const copyOfQueue = [...state.queue];
      return {
        ...state,
        queue: copyOfQueue.filter((quest) => quest._id !== action.payload.quest._id),
        history: [...state.history, action.payload.quest],
      };

    case 'DELETE_QUEST':
      return {
        ...state,
        queue: state.queue.filter((quest) => quest._id !== action.payload.questId),
        history: [...state.history],
      };

    case 'LOGOUT':
      return {
        roomId: null,
        queue: [],
      };

    default:
      return state;
  }
};
