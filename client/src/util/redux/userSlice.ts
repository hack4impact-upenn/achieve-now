/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface UserState {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  isOnboarded: boolean | null;
}

interface Payload {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isOnboarded: boolean;
}

const initialState = {
  email: null,
  firstName: null,
  lastName: null,
  role: null,
  isOnboarded: null,
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
      state.isOnboarded = action.payload.isOnboarded;
    },
    changeRole: (state, action: PayloadAction<{ role: string }>) => {
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.role = null;
      state.isOnboarded = null;
    },
    onboardUserStore: (
      state,
      action: PayloadAction<{ firstName: string; lastName: string }>,
    ) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.isOnboarded = true;
    },
  },
});

export const { login, logout, changeRole, onboardUserStore } =
  userSlice.actions;
export default userSlice.reducer;

/**
 * A selector that returns the user state
 * @param state The redux store state
 * @returns The user state
 */
export const selectUser = (state: RootState) => state.user;
