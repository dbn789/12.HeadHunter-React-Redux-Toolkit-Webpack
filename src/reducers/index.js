import { configureStore } from '@reduxjs/toolkit';
import hhReducer from './hhReduser';

export const store = configureStore({
    reducer: {
        hhReducer,
    },
});
