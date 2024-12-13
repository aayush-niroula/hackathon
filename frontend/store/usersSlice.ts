import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
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
      state.users.push(...action.payload); // Add multiple users
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload); // Add a single user
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
  },
});

export const { addUser, addUsers, removeUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
