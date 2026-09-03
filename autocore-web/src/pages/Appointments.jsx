import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";
import SearchableSelect from "../components/SearchableSelect";
import { 
  Calendar, 
  Save, 
  XCircle, 
  Plus, 
  History, 
  ArrowLeft, 
  Search, 
  ChevronRight
} from "lucide-react";
import { useLocation } from "react-router-dom";

function Appointments() {
  const location = useLocation();
  const [viewMode, setViewMode] = useState("list"); // "list" | "form"
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Draft");

  const [formData, setFormData] = useState({
    title: "Maintenance Appointment Booking",
    customer_id: "",
    vehicle_id: "",
    chassis_number: "",
    license_plate: "",
    service_type: "Periodic Maintenance",
    sub_service: "Comprehensive Check & Oil Service",
    branch: "Main Workshop - Bay 01",
    advisor: "Philip Ishak",
    appointment_date: "2026-09-05",
    appointment_time: "10:30 AM",
    notes: ""
  });

  const [logs, setLogs] = useState([
    { id: 1, user: "System", text: "Ready to create or modify appointment.", time: "Now" }
  ]);
  const [newLog, setNewLog] = useState("");

  const loadAll = async () => {
    try {
      const [appRes, cRes, vRes] = await Promise.all([
        api.get("/appointments/").catch(() => api.get("/appointments")).catch(() => ({ data: [] })),
        api.get("/customers/").catch(() => api.get("/customers")).catch(() => ({ data: [] })),
        api.get("/vehicles/").catch(() => api.get("/vehicles")).catch(() => ({ data: [] }))
      ]);
      setAppointmentsList(Array.isArray(appRes.data) ? appRes.data : []);
      setCustomers(Array.isArray(cRes.data) ? cRes.data : []);
      setVehicles(Array.isArray(vRes.data) ? vRes.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (location.state?.customer_id) {
      setViewMode("form");
      setSelectedId(null);
      const cId = String(location.state.customer_id);
      const vId = location.state.vehicle_id ? String(location.state.vehicle_id) : "";
      
      const selectedVeh = vehicles.find(v => v.id === parseInt(vId));

      setFormData(prev => ({
        ...prev,
        customer_id: cId,
        vehicle_id: vId,
        license_plate: selectedVeh ? selectedVeh.plate_number : prev.license_plate,
        chassis_number: selectedVeh ? (selectedVeh.vin || "VIN-8492049210") : prev.chassis_number
      }));

      setLogs([{ id: Date.now(), user: "System", text: "Linked successfully with Call Center record.", time: "Now" }]);
    }
  }, [location.state, vehicles]);

  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
  const vehMap = Object.fromEntries(vehicles.map(v => [v.id, `${v.brand} ${v.model} (${v.plate_number})`]));

  const handleOpenNew = () => {
    setSelectedId(null);
    setStatus("Draft");
    setFormData({
      title: "New Service Appointment Booking",
      customer_id: "",
      vehicle_id: "",
      chassis_number: "",
      license_plate: "",
      service_type: "Periodic Maintenance",
      sub_service: "10,000 KM Engine & Filter Service",
      branch: "Main Workshop - Bay 01",
      advisor: "Philip Ishak",
      appointment_date: "2026-09-05",
      appointment_time: "10:30 AM",
      notes: ""
    });
    setLogs([{ id: 1, user: "System", text: "New draft form initialized.", time: "Now" }]);
    setViewMode("form");
  };

  const handleOpenEdit = (app) => {
    setSelectedId(app.id);
    setStatus(app.status || "Draft");

    let dateStr = "2026-09-05";
    if (app.appointment_date) {
      dateStr = String(app.appointment_date).split("T")[0];
    }

    const veh = vehicles.find(v => v.id === app.vehicle_id);

    setFormData({
      title: `Booking #${app.id} - Appointment Details`,
      customer_id: app.customer_id ? String(app.customer_id) : "",
      vehicle_id: app.vehicle_id ? String(app.vehicle_id) : "",
      chassis_number: veh?.vin || "VIN-8492049210",
      license_plate: veh?.plate_number || "",
      service_type: app.service_type || "Periodic Maintenance",
      sub_service: "General Service Scope",
      branch: "Main Workshop - Bay 01",
      advisor: app.advisor || "Philip Ishak",
      appointment_date: dateStr,
      appointment_time: app.appointment_time || "10:30 AM",
      notes: app.notes || ""
    });

    setLogs([{ id: Date.now(), user: "System", text: `Loaded Appointment #${app.id}.`, time: "Just now" }]);
    setViewMode("form");
  };

  const handleVehicleChange = (vehId) => {
    const v = vehicles.find(item => item.id === parseInt(vehId));
    setFormData({
      ...formData,
      vehicle_id: vehId,
      license_plate: v ? v.plate_number : "",
      chassis_number: v ? (v.vin || "VIN-8492049210") : ""
    });
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLog.trim()) return;
    setLogs([{ id: Date.now(), user: "Advisor", text: newLog, time: "Just now" }, ...logs]);
    setNewLog("");
  };

  const handleSaveOrConfirm = async (targetStatus) => {
    if (!formData.customer_id) {
      alert("Please select a customer first!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_id: parseInt(formData.customer_id),
        vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : null,
        appointment_date: formData.appointment_date || "2026-09-05",
        appointment_time: formData.appointment_time || "10:30 AM",
        service_type: formData.service_type || "Periodic Maintenance",
        advisor: formData.advisor || "Philip Ishak",
        status: targetStatus,
        notes: formData.notes || ""
      };

      if (selectedId) {
        await api.put(`/appointments/${selectedId}`, payload).catch(() => api.patch(`/appointments/${selectedId}`, payload));
        alert(`Appointment #${selectedId} updated!`);
      } else {
        const res = await api.post("/appointments/", payload).catch(() => api.post("/appointments", payload));
        if (res?.data?.id) setSelectedId(res.data.id);
        alert(`Appointment saved as [${targetStatus}]!`);
      }

      setStatus(targetStatus);
      await loadAll();
    } catch (err) {
      alert("Error saving appointment: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const currentCustomerVehicles = vehicles.filter(v => v.customer_id === parseInt(formData.customer_id));
  const filteredAppointments = appointmentsList.filter((a) => {
    const custName = custMap[a.customer_id]?.name?.toLowerCase() || "";
    return custName.includes(search.toLowerCase());
  });

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800" dir="ltr">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 flex-1 flex flex-col space-y-4 max-w-[1700px] w-full mx-auto">
          
          {viewMode === "list" ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 text-white p-7 rounded-3xl shadow-xl shadow-slate-900/10">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest mb-1.5">
                    <Calendar size={16} />
                    <span>Workshop Booking Center</span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight">Appointments Schedule</h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Manage service reservations, filter bookings, or create a new slot
                  </p>
                </div>

                <button
                  onClick={handleOpenNew}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 transition"
                >
                  <Plus size={18} />
                  <span>New Appointment</span>
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="relative w-96">
                  <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by client name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 pr-3">
                  Total Bookings: <span className="text-blue-600 font-black">{filteredAppointments.length}</span>
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-extrabold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Ref #</th>
                        <th className="px-6 py-4">Customer Name</th>
                        <th className="px-6 py-4">Vehicle</th>
                        <th className="px-6 py-4">Date & Slot</th>
                        <th className="px-6 py-4">Advisor</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-bold text-slate-600">No appointments found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((app) => {
                          const customer = custMap[app.customer_id];
                          return (
                            <tr 
                              key={app.id} 
                              onClick={() => handleOpenEdit(app)}
                              className="hover:bg-blue-50/50 cursor-pointer transition"
                            >
                              <td className="px-6 py-4 font-mono font-black text-blue-600">
                                #{app.id}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-extrabold text-slate-800">{customer?.name || "Client"}</div>
                                <div className="text-[11px] text-slate-400">{customer?.phone}</div>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-700">
                                {vehMap[app.vehicle_id] || "No Vehicle Assigned"}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{app.appointment_date}</div>
                                <div className="text-[11px] text-blue-600 font-semibold">{app.appointment_time}</div>
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-600">
                                {app.advisor || "Philip Ishak"}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                                  app.status === "Booked" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                  app.status === "Cancelled" ? "bg-rose-50 text-rose-700 border-rose-200" :
                                  "bg-slate-100 text-slate-700 border-slate-300"
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-blue-600 font-bold text-xs inline-flex items-center gap-1">
                                  Edit <ChevronRight size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (

            <div className="space-y-4">
              <div className="bg-white px-6 py-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition"
                  >
                    <ArrowLeft size={15} /> Back to All
                  </button>

                  <button
                    onClick={() => handleSaveOrConfirm("Booked")}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition disabled:opacity-50"
                  >
                    <Save size={15} /> {selectedId ? "Save Changes" : "Confirm Booking"}
                  </button>

                  <button
                    onClick={() => handleSaveOrConfirm("Cancelled")}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition"
                  >
                    <XCircle size={15} /> Cancel Booking
                  </button>
                </div>

                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 p-1 text-xs font-bold">
                  {["Draft", "Booked", "Cancelled"].map((st) => (
                    <div
                      key={st}
                      onClick={() => handleSaveOrConfirm(st)}
                      className={`cursor-pointer px-4 py-1.5 rounded-lg transition ${
                        status === st
                          ? "bg-white text-blue-600 shadow-sm font-extrabold border border-slate-200"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                <div className="xl:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 space-y-8">
                  <div className="border-b border-slate-100 pb-5 flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-black uppercase text-blue-600 tracking-wider">
                        {selectedId ? `Editing Appointment #${selectedId}` : "Creating New Appointment"}
                      </span>
                      <input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full text-2xl font-black text-slate-900 border-none outline-none focus:ring-0 placeholder:text-slate-300 mt-1"
                      />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                      status === "Booked" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      status === "Cancelled" ? "bg-rose-50 text-rose-700 border-rose-200" :
                      "bg-slate-100 text-slate-700 border-slate-300"
                    }`}>
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Customer Name *</label>
                      <SearchableSelect
                        options={customers}
                        value={formData.customer_id}
                        onChange={(val) => setFormData({ ...formData, customer_id: val, vehicle_id: "" })}
                        placeholder="Search & select customer..."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Service Advisor</label>
                      <input
                        value={formData.advisor}
                        onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Workshop Branch</label>
                      <input
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Booking Date</label>
                        <input
                          type="date"
                          value={formData.appointment_date}
                          onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Slot Time</label>
                        <input
                          type="text"
                          value={formData.appointment_time}
                          onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Vehicle Specifications
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Vehicle</label>
                        <select
                          value={formData.vehicle_id}
                          onChange={(e) => handleVehicleChange(e.target.value)}
                          className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                        >
                          <option value="">Choose vehicle...</option>
                          {currentCustomerVehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate_number})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Plate Number</label>
                        <input
                          readOnly
                          value={formData.license_plate}
                          placeholder="e.g. 5465"
                          className="w-full text-xs font-mono font-bold px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Chassis / VIN</label>
                        <input
                          readOnly
                          value={formData.chassis_number}
                          placeholder="e.g. VIN-XXXX"
                          className="w-full text-xs font-mono font-bold px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Service Scope & Remarks
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Primary Service</label>
                        <select
                          value={formData.service_type}
                          onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                          className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value="Periodic Maintenance">Periodic Maintenance</option>
                          <option value="Brake System Service">Brake System Service</option>
                          <option value="Electrical Diagnosis">Electrical Diagnosis</option>
                          <option value="General Inspection">General Inspection</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">Sub Service</label>
                        <input
                          value={formData.sub_service}
                          onChange={(e) => setFormData({ ...formData, sub_service: e.target.value })}
                          className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Symptoms & Instructions</label>
                      <textarea
                        rows={2}
                        placeholder="Customer notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                      <History size={16} className="text-blue-600" />
                      <span>Activity & Chatter</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      {logs.length} updates
                    </span>
                  </div>

                  <form onSubmit={handleAddLog} className="relative">
                    <input
                      type="text"
                      placeholder="Log internal note..."
                      value={newLog}
                      onChange={(e) => setNewLog(e.target.value)}
                      className="w-full text-xs font-medium pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="absolute right-2 top-2 p-1 text-slate-400 hover:text-blue-600">
                      <Save size={15} />
                    </button>
                  </form>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px] pr-1">
                    {logs.map((log) => (
                      <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-extrabold text-slate-800">{log.user}</span>
                          <span className="text-slate-400">{log.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">{log.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Appointments;