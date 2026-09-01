import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Car, 
  Calendar, 
  PhoneCall, 
  Ticket, 
  CarFront, 
  Pencil, 
  Trash2, 
  Star 
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";

function CustomerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("vehicles");

  const loadCustomer = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/customers/${id}/profile`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load customer profile:", err);
      setError("Customer not found or error fetching data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  const appointmentStatusStyles = {
    Scheduled: "bg-green-100 text-green-700 border-l-4 border-green-500",
    Pending: "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500",
    Completed: "bg-blue-100 text-blue-700 border-l-4 border-blue-500",
    Cancelled: "bg-red-100 text-red-700 border-l-4 border-red-500"
  };

  const renderColorCircle = (color) => {
    if (!color) return <span className="text-gray-400 font-normal">Not Specified</span>;

    const lowerColor = color.toLowerCase();
    let bgClass = "bg-slate-400";

    if (lowerColor.includes("black") || lowerColor.includes("أسود")) bgClass = "bg-slate-900";
    if (lowerColor.includes("white") || lowerColor.includes("أبيض")) bgClass = "bg-white border border-slate-300";
    if (lowerColor.includes("red") || lowerColor.includes("أحمر")) bgClass = "bg-rose-600";
    if (lowerColor.includes("blue") || lowerColor.includes("أزرق")) bgClass = "bg-blue-600";

    return (
      <span className="inline-flex items-center gap-1.5 capitalize font-semibold text-slate-800">
        <span className={`w-3.5 h-3.5 rounded-full shadow-sm inline-block ${bgClass}`}></span>
        {color}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="p-8 text-center text-slate-500 font-medium">
            Loading Customer 360 Profile...
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="p-8 text-center text-rose-600 font-semibold">
            {error || "Customer Not Found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200 px-8 py-4" />

        <div className="p-8 flex-1">
          {/* Back Button */}
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold mb-6 transition"
          >
            <ArrowLeft size={18} />
            <span>Back to Customers</span>
          </Link>

          {/* Header Card / Quick Info Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  {data.customer?.name?.charAt(0) || <User />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {data.customer?.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold shadow-sm">
                      <Star size={13} className="fill-amber-400 text-amber-500" /> VIP Customer
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">{data.customer?.mobile || "No Mobile"}</p>
                  <p className="text-slate-500 text-sm">{data.customer?.email || "No Email"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs font-medium">
                <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 block">Customer Since</span>
                  <span className="font-bold text-slate-800">30 Jul 2026</span>
                </div>

                <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 block">Last Visit</span>
                  <span className="font-bold text-slate-800">30 Jul 2026</span>
                </div>

                <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 block">Last Call</span>
                  <span className="font-bold text-slate-800">2 Aug 2026</span>
                </div>

                <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 block">Last Service</span>
                  <span className="font-bold text-blue-600">10000 KM</span>
                </div>

                <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 block">Total Vehicles</span>
                  <span className="font-bold text-slate-800">{data.vehicles?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-4 mb-8">
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
                activeTab === "vehicles"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Car size={18} />
              <span>Vehicles ({data.vehicles?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("appointments")}
              className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
                activeTab === "appointments"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Calendar size={18} />
              <span>Appointments ({data.appointments?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("calls")}
              className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
                activeTab === "calls"
                  ? "border-amber-500 text-amber-500"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <PhoneCall size={18} />
              <span>Calls ({data.calls?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("tickets")}
              className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
                activeTab === "tickets"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Ticket size={18} />
              <span>Tickets ({data.tickets?.length || 0})</span>
            </button>
          </div>

          {/* Active Tab Views */}
          <div className="space-y-6">
            {/* 1. VEHICLES TAB */}
            {activeTab === "vehicles" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-800">
                  Registered Vehicles
                </h2>

                {data.vehicles && data.vehicles.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.vehicles.map((vehicle) => (
                      <Link 
                        key={vehicle.id} 
                        to={`/vehicles/${vehicle.id}`} 
                        className="block group"
                      >
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 group-hover:shadow-2xl group-hover:border-blue-300 group-hover:-translate-y-1 transition duration-300 flex flex-col justify-between cursor-pointer">
                          <div>
                            <div className="flex justify-between items-start mb-5">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                  <CarFront size={32} />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition">
                                    {vehicle.brand} {vehicle.model}
                                  </h3>
                                  <p className="text-gray-400 text-xs font-semibold mt-0.5">
                                    {vehicle.model_year || vehicle.year || "N/A"} Model
                                  </p>
                                </div>
                              </div>

                              <div 
                                className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-white rounded-lg transition" title="Edit Vehicle">
                                  <Pencil size={15} />
                                </button>
                                <button className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition" title="Delete Vehicle">
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-slate-100 text-sm">
                              <div>
                                <p className="text-gray-400 text-xs font-medium">Plate Number</p>
                                <span className="inline-block mt-0.5 bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full font-mono font-bold text-xs">
                                  {vehicle.plate_number || <span className="text-gray-400 font-normal">Not Specified</span>}
                                </span>
                              </div>

                              <div>
                                <p className="text-gray-400 text-xs font-medium">Current KM</p>
                                <span className="inline-block mt-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-xs">
                                  {vehicle.current_km != null ? `${vehicle.current_km.toLocaleString()} KM` : "0 KM"}
                                </span>
                              </div>

                              <div>
                                <p className="text-gray-400 text-xs font-medium">Chassis</p>
                                <p className="font-semibold text-slate-800 font-mono text-xs truncate">
                                  {vehicle.chassis_number || <span className="text-gray-400 font-normal">Not Specified</span>}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-400 text-xs font-medium">Engine</p>
                                <p className="font-semibold text-slate-800 font-mono text-xs truncate">
                                  {vehicle.engine_number || <span className="text-gray-400 font-normal">Not Specified</span>}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-400 text-xs font-medium">Fuel</p>
                                <p className="font-semibold text-slate-800 text-xs">
                                  {vehicle.fuel_type || <span className="text-gray-400 font-normal">Not Specified</span>}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-400 text-xs font-medium">Transmission</p>
                                <p className="font-semibold text-slate-800 text-xs">
                                  {vehicle.transmission || <span className="text-gray-400 font-normal">Not Specified</span>}
                                </p>
                              </div>

                              <div className="col-span-2 pt-1 border-t border-slate-50">
                                <p className="text-gray-400 text-xs font-medium">Color</p>
                                <div className="mt-0.5 text-xs">
                                  {renderColorCircle(vehicle.color)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center text-gray-500 border border-slate-200">
                    No Vehicles Found
                  </div>
                )}
              </div>
            )}

            {/* 2. APPOINTMENTS TAB */}
            {activeTab === "appointments" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-800">
                  Appointments History
                </h2>

                <div className="space-y-5">
                  {data.appointments && data.appointments.length > 0 ? (
                    data.appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`bg-white rounded-2xl shadow-md p-6 ${
                          appointmentStatusStyles[appointment.status] || "bg-gray-50 border-l-4 border-gray-400"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">
                              {appointment.service_type || "Maintenance Service"}
                            </h3>

                            <p className="text-gray-500 mt-1 text-sm font-medium">
                              {appointment.appointment_date
                                ? new Date(appointment.appointment_date).toLocaleDateString("en-GB")
                                : "N/A"}
                            </p>

                            <p className="text-gray-500 text-sm font-mono mt-0.5">
                              {appointment.appointment_time || "N/A"}
                            </p>
                          </div>

                          <span className="px-4 py-1 rounded-full font-semibold text-xs shadow-sm bg-white/80">
                            {appointment.status || "Scheduled"}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                          <div>
                            <p className="text-gray-400 text-sm font-medium">Advisor</p>
                            <p className="font-semibold text-slate-800 text-sm">
                              {appointment.advisor || appointment.advisor_name || "Not Assigned"}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-400 text-sm font-medium">Notes</p>
                            <p className="font-semibold text-slate-800 text-sm">
                              {appointment.notes || "No Notes"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl p-10 text-center text-gray-500 border border-slate-200">
                      No Appointments Found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. CALLS TAB */}
            {activeTab === "calls" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-800">
                  Call History
                </h2>

                <div className="space-y-5">
                  {data.calls && data.calls.length > 0 ? (
                    data.calls.map((call) => (
                      <div
                        key={call.id}
                        className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              {call.call_type || call.subject || "Customer Call"}
                            </h3>

                            <p className="text-gray-500 mt-1 text-sm font-medium">
                              {call.created_at || call.date
                                ? new Date(call.created_at || call.date).toLocaleString("en-GB", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })
                                : "N/A"}
                            </p>
                          </div>

                          <span
                            className={`px-4 py-1 rounded-full font-semibold text-xs shadow-sm ${
                              call.status === "Open"
                                ? "bg-green-100 text-green-700"
                                : call.status === "Closed"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {call.status || "Closed"}
                          </span>
                        </div>

                        <div className="mt-5">
                          <p className="text-gray-400 text-sm mb-2">Notes</p>

                          <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-sm border border-slate-100">
                            {call.notes || call.summary || "No Notes"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl p-10 text-center text-gray-500 border border-slate-200">
                      No Calls Found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. TICKETS TAB */}
            {activeTab === "tickets" && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900 text-slate-200 uppercase text-xs font-bold tracking-wider">
                      <tr>
                        <th className="p-4">Ticket ID</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.tickets && data.tickets.length > 0 ? (
                        data.tickets.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50 transition">
                            <td className="p-4 font-mono font-bold text-slate-500">#{t.id}</td>
                            <td className="p-4 text-slate-800 font-semibold">{t.title || "-"}</td>
                            <td className="p-4">
                              <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full font-bold text-xs shadow-sm">
                                {t.status || "Open"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center py-10 text-slate-400">
                            No tickets found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;