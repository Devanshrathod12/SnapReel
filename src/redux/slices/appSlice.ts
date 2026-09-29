import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MyStory {
  id: string;
  mediaUri: string;
  mediaType: 'photo' | 'video';
  caption: string;
  audience: string;
  allowComments: boolean;
  createdAt: number;
}

interface AppState {
  myStories: MyStory[];
}

const initialState: AppState = {
  myStories: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addStory: (state, action: PayloadAction<MyStory>) => {
      state.myStories.unshift(action.payload);
    },
  },
});

export const { addStory } = appSlice.actions;
export default appSlice.reducer;
