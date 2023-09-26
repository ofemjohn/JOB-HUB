import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Profile from "./pages/Dashboard";
import JobListing from './pages/JobListing';
import SearchByLocation from "./pages/SearchByLocation";
import ApplyForJob from "./pages/ApplyForJob";
import Applications from "./pages/Applications";
import NotFound from "./pages/NotFound";
import UnAuthorized from "./pages/UnAuthorized";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { SnackbarProvider } from './components/SnackBarContext';
import ToastMessage from './components/ToastMessage'



const App = () => {
  return (
     <SnackbarProvider>
      <Routes>
      <Route path="/dashboard" element={<Profile />} />
      <Route path="/" element={<Layout />}>
        {/* Use 'index' for the Home component */}
        <Route index element={<Home />} />

        {/* Other routes */}
        <Route path="/login" element={<Login />} />
        {/* Correct the path name here */}
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="/get_joblistings" element={<JobListing />} />
        <Route path="/searchLocation" element={<SearchByLocation />} />
        <Route path="/apply_job" element={<ApplyForJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      </Routes>
      <ToastMessage />
      </SnackbarProvider>
  );
};

export default App;
