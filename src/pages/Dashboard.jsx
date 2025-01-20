import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { selectInterviews } from "../redux/interviewSlice";
import Sidebar from "../components/Sidebar";
import FilterModal from "../components/FilterModal";
import { appliedFilter } from "../redux/filterSlice";
import { Link } from "react-router-dom";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Dashboard = () => {
  const interviews = useSelector(selectInterviews);
  const appliedFilters = useSelector(appliedFilter);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("calendar");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredInterviews, setFilteredInterviews] = useState(interviews);

  useEffect(() => {
    if (
      !appliedFilters.interviewerId &&
      !appliedFilters.intervieweeId &&
      !appliedFilters.date
    ) {
      setFilteredInterviews(interviews);
    } else {
      setFilteredInterviews(
        interviews.filter((interview) => {
          const matchesInterviewer =
            !appliedFilters.interviewerId ||
            interview.interviewerId === appliedFilters.interviewerId;
          const matchesInterviewee =
            !appliedFilters.intervieweeId ||
            interview.intervieweeId === appliedFilters.intervieweeId;
          const matchesDate =
            !appliedFilters.date || interview.date === appliedFilters.date;

          return matchesInterviewer && matchesInterviewee && matchesDate;
        })
      );
    }
  }, [appliedFilters, interviews]);

  const events = filteredInterviews.map((interview) => {
    const start = new Date(`${interview.date}T${interview.timeSlot}`);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    return {
      id: interview.id,
      start: start,
      end: end,
      title: interview.agenda,
      type: interview.type,
      interviewee: interview.interviewee,
      interviewer: interview.interviewer,
      intervieweeId: interview.intervieweeId,
      interviewerId: interview.interviewerId,
    };
  });

  const handleEventClick = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    event.date = start.toISOString().split("T")[0];
    event.start = start.toTimeString().split(" ")[0];
    event.end = end.toTimeString().split(" ")[0];

    setSelectedEvent(event);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedEvent(null);
  };

  const handleViewSwitch = () => {
    setView((prev) => (prev === "calendar" ? "list" : "calendar"));
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="h-16 bg-black text-white px-6 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-3 py-1.5 bg-white text-black rounded hover:bg-gray-100 transition-colors duration-200 text-sm sm:px-4 sm:py-2 sm:text-base"
          >
            Filters
          </button>
          <button
            onClick={handleViewSwitch}
            className="px-3 py-1.5 bg-white text-black rounded hover:bg-gray-100 transition-colors duration-200 text-sm sm:px-4 sm:py-2 sm:text-base"
          >
            {view === "calendar" ? "List" : "Calendar"}
          </button>
          <Link
            to="/schedule"
            className="px-3 py-1.5 bg-white text-black rounded hover:bg-gray-100 transition-colors duration-200 text-sm sm:px-2 sm:py-2 sm:text-base"
          >
            Schedule
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`transition-all duration-300 h-full ${
            sidebarOpen ? "w-2/3" : "w-full"
          }`}
        >
          {view === "calendar" ? (
            <div className="h-full p-4">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "calc(100vh - 7rem)" }}
                onSelectEvent={handleEventClick}
                className="bg-white shadow-lg rounded-lg"
              />
            </div>
          ) : (
            <div className="h-full overflow-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <div
                      key={index}
                      onClick={() => handleEventClick(event)}
                      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold truncate mb-2">
                        {event.title}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span>{event.start.toLocaleDateString()}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span>
                            {event.start.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Interviewee:</span>
                          <span className="font-medium">
                            {event.interviewee}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Interviewer:</span>
                          <span className="font-medium">
                            {event.interviewer}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center col-span-full">
                    No events available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          event={selectedEvent}
          onClose={handleCloseSidebar}
        />
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
