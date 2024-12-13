import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  email: string;
  semester: string;
  role: string;
}

interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: []
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload; // Overwrite users array
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user._id !== action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
  },
});

export const { addUsers, removeUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
