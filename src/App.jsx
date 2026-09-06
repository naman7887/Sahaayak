import "./App.css";
import WorkerDashboard from "./pages/WorkerDashboard";
import Dashboard from "./pages/Dashboard";
import FindServices from "./pages/FindServices.jsx";
import ServiceDetails from "./pages/ServiceDetails";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkerMatching from "./pages/WorkerMatching";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
  path="/worker-matching"
  element={<WorkerMatching />}
/>
        <Route
  path="/worker-dashboard"
  element={<WorkerDashboard />}
/>
        <Route
  path="/find-services"
  element={<FindServices />}
/><Route
  path="/service-details"
  element={<ServiceDetails />}
/>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;