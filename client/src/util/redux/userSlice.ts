/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface UserState {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}

interface Payload {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const initialState = {
  email: null,
  firstName: null,
  lastName: null,
  role: null,
} as UserState;

/**
 * A slice of the redux store that contains the user's information. This slice defines reducer for logging in a user, logging out a user, and promoting a user to admin.
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Payload>) => {
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.role = action.payload.role;
    },
    changeRole: (state, action: PayloadAction<Payload>) => {
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.role = null;
    },
  },
});

export const { login, logout, changeRole } = userSlice.actions;
export default userSlice.reducer;

/**
 * A selector that returns the user state
 * @param state The redux store state
 * @returns The user state
 */
export const selectUser = (state: RootState) => state.user;
