import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInterview, selectInterviews } from "../redux/interviewSlice";
import { Link } from "react-router-dom";
import {
  interviewers,
  interviewees,
  checkForConflicts,
  getAvailableTimeSlots,
  convertTo12HourFormat
} from "../helper";
import toast from "react-hot-toast";

const ScheduleInterview = () => {
  const dispatch = useDispatch();
  const interviews = useSelector(selectInterviews);

  const [intervieweeId, setIntervieweeId] = useState("");
  const [interviewerId, setInterviewerId] = useState("");
  const [agenda, setAgenda] = useState("");
  const [type, setType] = useState("HR");
  const [timeSlot, setTimeSlot] = useState("");
  const [date, setDate] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Hello");
    const interviewee = interviewees.find((i) => i.id === intervieweeId);
    const interviewer = interviewers.find((i) => i.id === interviewerId);

    const newInterview = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      intervieweeId,
      interviewerId,
      interviewee: interviewee ? interviewee.name : "",
      interviewer: interviewer ? interviewer.name : "",
      agenda,
      type,
      timeSlot,
      date,
    };
    console.log(newInterview);
    
    if (!date || !timeSlot || !intervieweeId || !interviewerId || !agenda.trim()) {
      toast.error("All fields are required!");
      return;
    }

    const hasConflict = checkForConflicts(newInterview, interviews);

    if(hasConflict.name) {
      toast.error(`Conflict detected! ${hasConflict.name} already has an interview scheduled at ${hasConflict.time}.`);
      return;
    } else {
      dispatch(addInterview(newInterview));
      toast.success("Interview scheduled successfully!");
    }
  };

  const isFormValid = interviewerId && intervieweeId && date;

  return (
    <div className="min-h-screen bg-white py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/" 
          className="inline-block mb-4 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-black text-white py-3 px-8">
            <h1 className="text-3xl font-bold text-center tracking-tight">Interview Scheduler</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-1">
            <div className="space-y-2">
              <label htmlFor="interviewee" className="block text-sm font-medium text-gray-700">
                Select Interviewee
              </label>
              <select
                id="interviewee"
                value={intervieweeId}
                onChange={(e) => setIntervieweeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-1 focus:ring-black text-gray-900"
              >
                <option value="">Select Interviewee</option>
                {interviewees.map((interviewee) => (
                  <option key={interviewee.id} value={interviewee.id}>
                    {interviewee.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="interviewer" className="block text-sm font-medium text-gray-700">
                Select Interviewer
              </label>
              <select
                id="interviewer"
                value={interviewerId}
                onChange={(e) => setInterviewerId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-1 focus:ring-black text-gray-900"
              >
                <option value="">Select Interviewer</option>
                {interviewers.map((interviewer) => (
                  <option key={interviewer.id} value={interviewer.id}>
                    {interviewer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-1 focus:ring-black text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">
                Select Time Slot
              </label>
              <select
                id="timeSlot"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className={`w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-1 focus:ring-black text-gray-900 ${
                  !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!isFormValid}
              >
                <option value="">Select Time Slot</option>
                {isFormValid &&
                  getAvailableTimeSlots(
                    interviews,
                    intervieweeId,
                    interviewerId,
                    date
                  ).map((slot, index) => (
                    <option key={index} value={slot}>
                      {convertTo12HourFormat(slot)}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="agenda" className="block text-sm font-medium text-gray-700">
                Agenda
              </label>
              <input
                id="agenda"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-1 focus:ring-black text-gray-900 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Interview Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-1 focus:ring-black text-gray-900"
              >
                <option value="HR">HR</option>
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-md text-white text-sm font-semibold transition-colors duration-200 ${
                  isFormValid
                    ? 'bg-black hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!isFormValid}
              >
                Schedule Interview
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;