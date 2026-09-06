import "./App.css";

import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkerProfile from "./pages/WorkerProfile";
import FindServices from "./pages/FindServices.jsx";
import ServiceDetails from "./pages/ServiceDetails";
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerMatching from "./pages/WorkerMatching";
import AdminDashboard from "./pages/AdminDashboard";
import WorkerWelfare from "./pages/WorkerWelfare";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/worker-profile" element={<WorkerProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/find-services" element={<FindServices />} />
        <Route path="/service-details" element={<ServiceDetails />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        <Route path="/worker-matching" element={<WorkerMatching />} />
        <Route path="/worker-welfare" element={<WorkerWelfare />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;