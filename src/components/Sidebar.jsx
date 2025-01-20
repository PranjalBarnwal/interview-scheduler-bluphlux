import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInterview, deleteInterview, selectInterviews } from "../redux/interviewSlice";
import { checkForConflicts, getAvailableTimeSlots, interviewees, interviewers,convertTo12HourFormat } from "../helper";
import { X, Edit2, Trash2, Calendar, Clock, UserCircle, Users, FileText, Save, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const Sidebar = ({ isOpen, event, onClose }) => {
  const dispatch = useDispatch();
  const interviews = useSelector(selectInterviews);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    timeSlot: "",
    type: "",
    intervieweeId: "",
    interviewerId: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        id: event?.id || "",
        title: event?.title || "",
        date: event?.date || "",
        timeSlot: event?.start || "",
        type: event?.type || "",
        intervieweeId: event?.intervieweeId || "",
        interviewerId: event?.interviewerId || "",
        interviewee: event?.interviewee || "",
        interviewer: event?.interviewer || "",
      });
    }
  }, [event]);

  const availableSlots = getAvailableTimeSlots(
    interviews,
    formData.interviewee,
    formData.interviewer,
    formData.date
  );

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => {
    const updatedEvent = {
      id: formData.id,
      title: formData.title,
      timeSlot: formData.timeSlot,
      type: formData.type,
      date: formData.date,
      interviewee: formData.interviewee,
      interviewer: formData.interviewer,
      intervieweeId: formData.intervieweeId,
      interviewerId: formData.interviewerId,
    };

    const hasConflict = checkForConflicts(updatedEvent, interviews);
    if(hasConflict.name) {
      toast.error(`Conflict detected! ${hasConflict.name} already has an interview scheduled at ${hasConflict.time}.`);
      return;
    }

    dispatch(updateInterview({ id: event.id, updatedData: updatedEvent }));
    toast.success("Event successfully updated!");
    onClose();
    setIsEditing(false);
  };

  const handleDeleteClick = () => setConfirmDelete(true);
  const confirmDeleteAction = () => {
    dispatch(deleteInterview({ id: event.id }));
    toast.success("Event successfully deleted!");
    onClose();
    setConfirmDelete(false);
  };
  const cancelDeleteAction = () => {
    setConfirmDelete(false);
    toast.error("Deletion cancelled.");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
    setConfirmDelete(false);
  };

  if (!event) return null;

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0 w-1/3" : "translate-x-full w-0"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-black text-white">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Interview" : "Interview Details"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isEditing ? (
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                  >
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>{convertTo12HourFormat(slot)}</option>
                      ))
                    ) : (
                      <option value="">No available slots</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                  >
                    <option value="HR">HR</option>
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Interviewee</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <select
                    name="intervieweeId"
                    value={formData.intervieweeId}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                  >
                    {interviewees.map((interviewee) => (
                      <option key={interviewee.id} value={interviewee.id}>
                        {interviewee.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Interviewer</label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <select
                    name="interviewerId"
                    value={formData.interviewerId}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                  >
                    {interviewers.map((interviewer) => (
                      <option key={interviewer.id} value={interviewer.id}>
                        {interviewer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-medium">{event.title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{convertTo12HourFormat(event.start.toString())}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{event.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <UserCircle className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Interviewee</p>
                  <p className="font-medium">{event.interviewee}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Interviewer</p>
                  <p className="font-medium">{event.interviewer}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {isEditing ? (
            <button
              onClick={handleSaveClick}
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              <Save size={18} />
              Save Changes
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleEditClick}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
              >
                <Edit2 size={18} />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-red-50 transition-colors duration-200"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {confirmDelete && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex items-center space-x-2 text-red-500 mb-4">
                <AlertCircle size={24} />
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              </div>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this interview? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDeleteAction}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
                <button
                  onClick={cancelDeleteAction}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;