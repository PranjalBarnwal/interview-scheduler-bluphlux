import { configureStore } from "@reduxjs/toolkit";
import interviewReducer from "./interviewSlice";
import filterReducer from "./filterSlice"

const store = configureStore({
  reducer: {
    interviews: interviewReducer,
    filters:filterReducer
  },
});

export default store;
