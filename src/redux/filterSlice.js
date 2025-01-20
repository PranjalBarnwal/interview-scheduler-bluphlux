import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    interviewerId: "",
    intervieweeId: "",
    date: "",
  },
  reducers: {
    updateFilter: (state, action) => {
      const { interviewerId, intervieweeId, date } = action.payload;
      state.intervieweeId = intervieweeId;
      state.interviewerId = interviewerId;
      state.date = date;
    },
  },
});

export const { updateFilter } = filterSlice.actions;

export const appliedFilter = (state) => state.filters;

export default filterSlice.reducer;
