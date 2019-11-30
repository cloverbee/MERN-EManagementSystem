const logger = store => next => action => {
    console.log('prev state', store.getState());
    console.log('dispatching', action);
    next(action);
    console.log('next state', store.getState());
  };
  export default logger;