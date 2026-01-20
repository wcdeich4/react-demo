import {configureStore} from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    counter: counterReducer,
  },
});

export type ThemeState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;