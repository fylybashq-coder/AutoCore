import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import Vehicles from "./pages/Vehicles";
import VehicleProfile from "./pages/VehicleProfile";
import JobCards from "./pages/JobCards";
import Appointments from "./pages/Appointments";
import Calls from "./pages/Calls";
import Tickets from "./pages/Tickets";
import Users from "./pages/Users";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/customers/:id" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
        <Route path="/vehicles/:id" element={<ProtectedRoute><VehicleProfile /></ProtectedRoute>} />
        <Route path="/job-cards" element={<ProtectedRoute><JobCards /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/calls" element={<ProtectedRoute><Calls /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;