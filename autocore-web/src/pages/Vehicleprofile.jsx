import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function VehicleProfile() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    loadVehicle();
  }, [id]);

  async function loadVehicle() {
    try {
      const res = await api.get(`/vehicles/${id}`);
      setVehicle(res.data.vehicle);
      setCustomer(res.data.customer);
      setAppointments(res.data.appointments || []);
      setCalls(res.data.calls || []);
    } catch (err) {
      console.error("Failed to fetch vehicle profile:", err);
    }
  }

  // 5) أثناء التحميل
  if (!vehicle) {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="p-8 text-center text-gray-500 font-medium">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="p-8 flex-1">
          {/* 6) بداية الصفحة - رابط العودة للمالك */}
          {customer ? (
            <Link
              to={`/customers/${customer.id}`}
              className="inline-block text-blue-600 hover:underline font-semibold mb-2"
            >
              ← Back to {customer.name}
            </Link>
          ) : (
            <Link
              to="/customers"
              className="inline-block text-blue-600 hover:underline font-semibold mb-2"
            >
              ← Back to Customers
            </Link>
          )}

          {/* 7) Header */}
          <div className="bg-white rounded-2xl shadow p-8 mt-4 border border-slate-100">
            <h1 className="text-4xl font-bold text-slate-900">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              {vehicle.model_year || vehicle.year || "N/A"} Model
            </p>
          </div>

          {/* 8) Summary Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            <div className="bg-white rounded-xl p-6 shadow border border-slate-100">
              <p className="text-gray-500 text-sm font-semibold">Current KM</p>
              <h2 className="text-4xl font-bold text-slate-900 mt-2">
                {vehicle.current_km != null ? vehicle.current_km.toLocaleString() : 0}
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow border border-slate-100">
              <p className="text-gray-500 text-sm font-semibold">Appointments</p>
              <h2 className="text-4xl font-bold text-emerald-600 mt-2">
                {appointments.length}
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow border border-slate-100">
              <p className="text-gray-500 text-sm font-semibold">Calls</p>
              <h2 className="text-4xl font-bold text-amber-500 mt-2">
                {calls.length}
              </h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow border border-slate-100">
              <p className="text-gray-500 text-sm font-semibold">Plate</p>
              <h2 className="text-2xl font-bold text-slate-800 font-mono mt-2">
                {vehicle.plate_number || "N/A"}
              </h2>
            </div>
          </div>

          {/* 9) Vehicle Technical Information */}
          <div className="bg-white rounded-2xl shadow mt-8 p-8 border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              Vehicle Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800">
              <div>
                <p className="text-gray-500 text-sm">Brand</p>
                <h3 className="text-lg font-semibold mt-0.5">{vehicle.brand}</h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Model</p>
                <h3 className="text-lg font-semibold mt-0.5">{vehicle.model}</h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Year</p>
                <h3 className="text-lg font-semibold mt-0.5">
                  {vehicle.model_year || vehicle.year || "-"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Plate</p>
                <h3 className="text-lg font-semibold font-mono mt-0.5">
                  {vehicle.plate_number || "-"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Chassis</p>
                <h3 className="text-lg font-semibold font-mono mt-0.5">
                  {vehicle.chassis_number || "-"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Engine</p>
                <h3 className="text-lg font-semibold font-mono mt-0.5">
                  {vehicle.engine_number || "-"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Transmission</p>
                <h3 className="text-lg font-semibold mt-0.5">
                  {vehicle.transmission || "-"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Fuel</p>
                <h3 className="text-lg font-semibold mt-0.5">
                  {vehicle.fuel_type || "-"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleProfile;