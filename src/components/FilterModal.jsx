import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { interviewees, interviewers } from "../helper";
import { useDispatch } from "react-redux";
import { updateFilter } from "../redux/filterSlice";

const FilterModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    interviewerId: "",
    intervieweeId: "",
    date: "",
  });

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateFilter(filters));
    onClose();
  };

  const handleReset = () => {
    setFilters({
      interviewerId: "",
      intervieweeId: "",
      date: "",
    });
    dispatch(updateFilter({
      interviewerId: "",
      intervieweeId: "",
      date: "",
    }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-50 transform transition-all">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Filter Interviews
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Interviewer
            </label>
            <select
              name="interviewerId"
              value={filters.interviewerId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-1 focus:ring-black text-gray-900"
            >
              <option value="">Select an interviewer</option>
              {interviewers.map((interviewer) => (
                <option key={interviewer.id} value={interviewer.id}>
                  {interviewer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Interviewee
            </label>
            <select
              name="intervieweeId"
              value={filters.intervieweeId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-1 focus:ring-black text-gray-900"
            >
              <option value="">Select an interviewee</option>
              {interviewees.map((interviewee) => (
                <option key={interviewee.id} value={interviewee.id}>
                  {interviewee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-1 focus:ring-black text-gray-900"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
            >
              Reset
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;
