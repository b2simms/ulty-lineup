import { configureStore, combineSlices } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import rosterReducer from "./rosterSlice";

const staticReducers = {
  counter: counterReducer,
  roster: rosterReducer,
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
