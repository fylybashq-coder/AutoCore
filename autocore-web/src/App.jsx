import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerProfile from "./pages/CustomerProfile";
import Vehicles from "./pages/Vehicles";
import VehicleProfile from "./pages/VehicleProfile"; // 10) استيراد الصفحة
import Appointments from "./pages/Appointments";
import Calls from "./pages/Calls";
import Tickets from "./pages/Tickets";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerProfile />} />
        <Route path="/vehicles" element={<Vehicles />} />
        
        {/* 10) إضافة مسار بروفايل السيارة */}
        <Route path="/vehicles/:id" element={<VehicleProfile />} />
        
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;