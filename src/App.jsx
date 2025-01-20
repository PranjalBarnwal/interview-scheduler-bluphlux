import { createHashRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; 
import ScheduleInterview from "./pages/ScheduleInterview"; 

const router = createHashRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/schedule",
    element: <ScheduleInterview />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
