import { configureStore, combineSlices } from "@reduxjs/toolkit";
import rosterReducer from "./rosterSlice";
import gameReducer from "./gameSlice";
import themeReducer from "./themeSlice";

const staticReducers = {
  roster: rosterReducer,
  game: gameReducer,
  theme: themeReducer,
};

export const dynamicReducer =
  combineSlices(staticReducers).withLazyLoadedSlices();

export const store = configureStore({
  reducer: dynamicReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
