import { createSlice } from "@reduxjs/toolkit";
import { initialState, interviewers, interviewees } from "../helper";

const interviewSlice = createSlice({
  name: "interviews",
  initialState: initialState,
  reducers: {
    addInterview: (state, action) => {
      console.log("Before:", state);
      state.push(action.payload);
      console.log("After:", state);
    },
    updateInterview: (state, action) => {
      const { id, updatedData } = action.payload;
      const { interviewerId, intervieweeId } = updatedData;
      const interviewee = interviewees.find((i) => i.id === intervieweeId).name;
      const interviewer = interviewers.find((i) => i.id === interviewerId).name;

      const index = state.findIndex((interview) => interview.id === id);
      if (index !== -1) {
        state[index] = {
          ...updatedData,
          interviewee: interviewee,
          interviewer: interviewer,
          agenda: updatedData.title,
          date: updatedData.date,
          start: updatedData.timeSlot,
        };
      }
    },
    deleteInterview: (state, action) => {
      const { id } = action.payload;
      const index = state.findIndex((interview) => interview.id === id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const { addInterview, updateInterview, deleteInterview } =
  interviewSlice.actions;

export const selectInterviews = (state) => state.interviews;

export default interviewSlice.reducer;
