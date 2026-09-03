import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";
import SearchableSelect from "../components/SearchableSelect";
import { 
  Car, 
  Search, 
  Plus, 
  Save, 
  ArrowLeft, 
  History, 
  Send, 
  Calendar, 
  ChevronRight 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Vehicles() {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState("list"); // "list" | "form"
  const [vehiclesList, setVehiclesList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    customer_id: "",
    brand: "Suzuki",
    model: "Swift",
    year: "2024",
    plate_number: "",
    vin: "",
    color: "Pearl White",
    fuel_type: "Gasoline"
  });

  const [logs, setLogs] = useState([
    { id: 1, user: "System", text: "Vehicle record initialized.", time: "Now" }
  ]);
  const [newLog, setNewLog] = useState("");

  const loadAll = async () => {
    try {
      const [vRes, cRes] = await Promise.all([
        api.get("/vehicles").catch(() => api.get("/vehicles/")).catch(() => ({ data: [] })),
        api.get("/customers").catch(() => api.get("/customers/")).catch(() => ({ data: [] }))
      ]);
      setVehiclesList(Array.isArray(vRes.data) ? vRes.data : []);
      setCustomers(Array.isArray(cRes.data) ? cRes.data : []);
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
      setFormData(prev => ({
        ...prev,
        customer_id: String(location.state.customer_id)
      }));
    }
  }, [location.state]);

  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));

  const handleOpenNew = () => {
    setSelectedId(null);
    setFormData({
      customer_id: "",
      brand: "Suzuki",
      model: "Swift",
      year: "2024",
      plate_number: "",
      vin: "",
      color: "Pearl White",
      fuel_type: "Gasoline"
    });
    setLogs([{ id: 1, user: "System", text: "New vehicle registration form opened.", time: "Now" }]);
    setViewMode("form");
  };

  const handleOpenEdit = (v) => {
    setSelectedId(v.id);
    setFormData({
      customer_id: v.customer_id ? String(v.customer_id) : "",
      brand: v.brand || "Suzuki",
      model: v.model || "Swift",
      year: String(v.year || "2024"),
      plate_number: v.plate_number || "",
      vin: v.vin || "",
      color: v.color || "Pearl White",
      fuel_type: v.fuel_type || "Gasoline"
    });
    setLogs([{ id: Date.now(), user: "System", text: `Loaded vehicle #${v.id}`, time: "Just now" }]);
    setViewMode("form");
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLog.trim()) return;
    setLogs([{ id: Date.now(), user: "Advisor", text: newLog, time: "Just now" }, ...logs]);
    setNewLog("");
  };

  const handleSaveVehicle = async () => {
    if (!formData.customer_id || !formData.plate_number.trim()) {
      alert("Please select customer and enter plate number!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_id: Number(formData.customer_id),
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year) || 2024,
        plate_number: formData.plate_number.trim(),
        vin: formData.vin || "VIN-849204",
        color: formData.color,
        fuel_type: formData.fuel_type
      };

      if (selectedId) {
        await api.patch(`/vehicles/${selectedId}`, payload).catch(() => api.put(`/vehicles/${selectedId}`, payload));
        alert(`Vehicle #${selectedId} updated successfully!`);
      } else {
        const res = await api.post("/vehicles", payload).catch(() => api.post("/vehicles/", payload));
        if (res?.data?.id) setSelectedId(res.data.id);
        alert("New vehicle registered successfully!");
      }

      await loadAll();
    } catch (err) {
      alert("Error saving vehicle: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehiclesList.filter(v => 
    (v.plate_number || "").toLowerCase().includes(search.toLowerCase()) || 
    (v.brand || "").toLowerCase().includes(search.toLowerCase()) ||
    (v.model || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800" dir="ltr">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 flex-1 flex flex-col space-y-4 max-w-[1700px] w-full mx-auto">
          
          {viewMode === "list" ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white p-7 rounded-3xl shadow-xl shadow-slate-900/10">
                <div>
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase tracking-widest mb-1.5">
                    <Car size={16} />
                    <span>Fleet & Workshop Assets</span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight">Vehicles Management</h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Manage client automobiles, chassis numbers, license plates, and service records
                  </p>
                </div>

                <button
                  onClick={handleOpenNew}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-purple-600/30 transition"
                >
                  <Plus size={18} />
                  <span>Register Vehicle</span>
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="relative w-96">
                  <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by plate number, brand or model..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 pr-3">
                  Total Fleet: <span className="text-purple-600 font-black">{filteredVehicles.length}</span>
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-extrabold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">ID #</th>
                        <th className="px-6 py-4">Vehicle Specs</th>
                        <th className="px-6 py-4">Plate Number</th>
                        <th className="px-6 py-4">Owner (Client)</th>
                        <th className="px-6 py-4">Color & Fuel</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredVehicles.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <Car size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-bold text-slate-600">No vehicles registered</p>
                          </td>
                        </tr>
                      ) : (
                        filteredVehicles.map((v) => {
                          const owner = custMap[v.customer_id];
                          return (
                            <tr 
                              key={v.id} 
                              onClick={() => handleOpenEdit(v)}
                              className="hover:bg-purple-50/40 cursor-pointer transition"
                            >
                              <td className="px-6 py-4 font-mono font-black text-purple-600">
                                #{v.id}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-extrabold text-slate-800">{v.brand} {v.model} ({v.year})</div>
                                <div className="text-[11px] font-mono text-slate-400">{v.vin || "VIN-849204"}</div>
                              </td>
                              <td className="px-6 py-4 font-mono font-bold text-slate-800">
                                {v.plate_number}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-700">
                                {owner?.name || "Unassigned"}
                              </td>
                              <td className="px-6 py-4 text-slate-500 font-medium">
                                {v.color} / {v.fuel_type}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-purple-600 font-bold text-xs inline-flex items-center gap-1">
                                  Open Asset <ChevronRight size={14} />
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
                    <ArrowLeft size={15} /> Back to Fleet
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveVehicle}
                    disabled={loading}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-purple-600/20 transition cursor-pointer disabled:opacity-50"
                  >
                    <Save size={15} /> {selectedId ? "Save Changes" : "Register Vehicle"}
                  </button>

                  <button
                    onClick={() => navigate("/appointments", { state: { customer_id: formData.customer_id, vehicle_id: selectedId } })}
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 transition"
                  >
                    <Calendar size={14} className="text-blue-600" /> Book Service
                  </button>
                </div>

                <span className="text-xs font-extrabold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  {selectedId ? `Vehicle Asset #${selectedId}` : "New Asset Draft"}
                </span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                <div className="xl:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 space-y-7">
                  
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[11px] font-black uppercase text-purple-600 tracking-wider">
                      Automobile File
                    </span>
                    <input
                      value={`${formData.brand} ${formData.model} (${formData.plate_number || 'New'})`}
                      readOnly
                      className="w-full text-2xl font-black text-slate-900 border-none outline-none focus:ring-0 bg-transparent mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Owner / Client *</label>
                        <SearchableSelect
                          options={customers}
                          value={formData.customer_id}
                          onChange={(val) => setFormData({ ...formData, customer_id: val })}
                          placeholder="Search & select owner..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Brand</label>
                          <input
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Model</label>
                          <input
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Model Year</label>
                          <input
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Color</label>
                          <input
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Plate Number *</label>
                        <input
                          value={formData.plate_number}
                          onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                          placeholder="e.g. 5465"
                          className="w-full text-xs font-mono font-bold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Chassis / VIN Number</label>
                        <input
                          value={formData.vin}
                          onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                          placeholder="e.g. VIN-8492049210"
                          className="w-full text-xs font-mono font-bold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Fuel Type</label>
                        <select
                          value={formData.fuel_type}
                          onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value="Gasoline">Gasoline</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Electric">Electric</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                      <History size={16} className="text-purple-600" />
                      <span>Chatter & Activity Log</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      {logs.length} updates
                    </span>
                  </div>

                  <form onSubmit={handleAddLog} className="relative">
                    <input
                      type="text"
                      placeholder="Post note..."
                      value={newLog}
                      onChange={(e) => setNewLog(e.target.value)}
                      className="w-full text-xs font-medium pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button type="submit" className="absolute right-2 top-2 p-1 text-slate-400 hover:text-purple-600">
                      <Send size={15} />
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

export default Vehicles;