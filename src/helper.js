export const initialState = [
  {
    id: "1234",
    intervieweeId: "2",
    interviewerId: "2",
    interviewee: "Raj Malhotra",
    interviewer: "Prem Chopra",
    agenda: "Final round for Delivery Team",
    type: "HR",
    timeSlot: "16:00:00",
    date: "2025-01-20",
  },
  {
    id: "5678",
    intervieweeId: "3",
    interviewerId: "3",
    interviewee: "Vijay Dinanath Chauhan",
    interviewer: "Mogambo",
    agenda: "Technical Discussion on Backend Development",
    type: "Technical",
    timeSlot: "14:00:00",
    date: "2025-01-20",
  },
  {
    id: "2211",
    intervieweeId: "4",
    interviewerId: "1",
    interviewee: "Rahul Khanna",
    interviewer: "Gabbar Singh",
    agenda: "Initial HR Screening",
    type: "HR",
    timeSlot: "12:00:00",
    date: "2025-01-21",
  },
  {
    id: "3322",
    intervieweeId: "5",
    interviewerId: "3",
    interviewee: "Geet Dhillon",
    interviewer: "Mogambo",
    agenda: "Technical Discussion on Frontend Development",
    type: "Technical",
    timeSlot: "13:00:00",
    date: "2025-01-21",
  },
  {
    id: "4455",
    intervieweeId: "6",
    interviewerId: "2",
    interviewee: "Basanti",
    interviewer: "Prem Chopra",
    agenda: "Leadership Role Interview",
    type: "HR",
    timeSlot: "15:00:00",
    date: "2025-01-21",
  },
  {
    id: "5566",
    intervieweeId: "7",
    interviewerId: "1",
    interviewee: "Bhuvan",
    interviewer: "Gabbar Singh",
    agenda: "Final Technical Interview for Backend Developer Role",
    type: "Technical",
    timeSlot: "17:00:00",
    date: "2025-01-21",
  },
  {
    id: "6677",
    intervieweeId: "8",
    interviewerId: "2",
    interviewee: "Rohit Mehra",
    interviewer: "Prem Chopra",
    agenda: "HR Discussion for R&D Team",
    type: "HR",
    timeSlot: "16:00:00",
    date: "2025-01-23",
  },
  {
    id: "7788",
    intervieweeId: "9",
    interviewerId: "3",
    interviewee: "Anjali Sharma",
    interviewer: "Mogambo",
    agenda: "Frontend Developer Technical Round",
    type: "Technical",
    timeSlot: "13:00:00",
    date: "2025-01-23",
  },
  {
    id: "8899",
    intervieweeId: "10",
    interviewerId: "1",
    interviewee: "Naina Talwar",
    interviewer: "Gabbar Singh",
    agenda: "Leadership Role Interview",
    type: "HR",
    timeSlot: "15:00:00",
    date: "2025-01-23",
  },
];

export const interviewees = [
  { id: "1", name: "Simran Singh" },
  { id: "2", name: "Raj Malhotra" },
  { id: "3", name: "Vijay Dinanath Chauhan" },
  { id: "4", name: "Rahul Khanna" },
  { id: "5", name: "Geet Dhillon" },
  { id: "6", name: "Basanti" },
  { id: "7", name: "Bhuvan" },
  { id: "8", name: "Rohit Mehra" },
  { id: "9", name: "Anjali Sharma" },
  { id: "10", name: "Naina Talwar" },
];

export const interviewers = [
  { id: "1", name: "Gabbar Singh" },
  { id: "2", name: "Prem Chopra" },
  { id: "3", name: "Mogambo" },
];


export const checkForConflicts = (newInterview, interviews) => {
  let result = { name: null, time: null };
  for (let interview of interviews) {
    if (interview.id == newInterview.id) {
      continue;
    }

    if (
      interview.date == newInterview.date &&
      interview.timeSlot == newInterview.timeSlot
    ) {
      if (interview.interviewerId == newInterview.interviewerId) {
        result.overlapWith = "interviewer";
        result.name = getInterviewerNameById(interview.interviewerId);
        result.time = interview.timeSlot;
        break;
      } else if (interview.intervieweeId == newInterview.intervieweeId) {
        result.overlapWith = "interviewee";
        result.name = getIntervieweeNameById(interview.interviewerId);
        result.time = interview.timeSlot;
        break;
      }
    }
  }

  return result;
};

export const getAvailableTimeSlots = (
  interviews,
  intervieweeId,
  interviewerId,
  date
) => {
  const allTimeSlots = [
    "12:00:00",
    "13:00:00",
    "14:00:00",
    "15:00:00",
    "16:00:00",
    "17:00:00",
    "18:00:00",
  ];

  const unavailableSlots = interviews
    .filter(
      (interview) =>
        interview.date === date && 
        (interview.intervieweeId === intervieweeId ||
          interview.interviewerId === interviewerId)
    )
    .map((interview) => interview.timeSlot);

  return allTimeSlots.filter((slot) => !unavailableSlots.includes(slot));
};

export const getInterviewerNameById = (id) => {
  const interviewer = interviewers.find((i) => i.id == id);
  if (interviewer) return interviewer.name;
  else return "null";
};

export const getIntervieweeNameById = (id) => {
  const interviewee = interviewees.find((i) => i.id == id);
  if (interviewee) return interviewee.name;
  else return "null";
};

export const convertTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hourIn12Format = hours % 12 || 12;
  return `${hourIn12Format}:${minutes.toString().padStart(2, "0")} ${period}`;
};
