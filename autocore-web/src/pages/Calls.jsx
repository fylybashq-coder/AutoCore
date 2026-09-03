import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";
import SearchableSelect from "../components/SearchableSelect";
import { 
  PhoneCall, 
  Search, 
  Plus, 
  Save, 
  ArrowLeft, 
  History, 
  Send, 
  Calendar, 
  TicketCheck, 
  Car, 
  Star,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Calls() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list"); // "list" | "form"
  const [callsList, setCallsList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("Confirmed"); // Confirmed | Cancelled | Pending | Held
  const [activeTab, setActiveTab] = useState("vehicles");

  // Form State
  const [formData, setFormData] = useState({
    date: "2026-09-03 12:11:41",
    direction: "In",
    call_type: "Periodic Maintenance Inquiry",
    sub_call_type: "General Followup",
    agent: "Philip Ishak",
    customer_id: "",
    vehicle_id: "",
    chassis_number: "",
    license_plate: "",
    phone: "",
    mobile: "",
    campaign: "Q3 Aftersales Campaign",
    priority: 2,
    duration: "03:45",
    summary: ""
  });

  const [logs, setLogs] = useState([
    { id: 1, user: "System", text: "Phonecall record created.", time: "Just now" }
  ]);
  const [newLog, setNewLog] = useState("");

  const loadAll = async () => {
    try {
      const [cRes, custRes, vehRes] = await Promise.all([
        api.get("/calls").catch(() => api.get("/calls/")).catch(() => ({ data: [] })),
        api.get("/customers").catch(() => api.get("/customers/")).catch(() => ({ data: [] })),
        api.get("/vehicles").catch(() => api.get("/vehicles/")).catch(() => ({ data: [] }))
      ]);
      setCallsList(Array.isArray(cRes.data) ? cRes.data : []);
      setCustomers(Array.isArray(custRes.data) ? custRes.data : []);
      setVehicles(Array.isArray(vehRes.data) ? vehRes.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
  const vehMap = Object.fromEntries(vehicles.map(v => [v.id, `${v.brand} ${v.model} (${v.plate_number})`]));

  const handleOpenNew = () => {
    setSelectedId(null);
    setStage("Confirmed");
    setFormData({
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
      direction: "In",
      call_type: "Periodic Maintenance Inquiry",
      sub_call_type: "General Followup",
      agent: "Philip Ishak",
      customer_id: "",
      vehicle_id: "",
      chassis_number: "",
      license_plate: "",
      phone: "",
      mobile: "",
      campaign: "Q3 Campaign",
      priority: 2,
      duration: "00:00",
      summary: ""
    });
    setLogs([{ id: 1, user: "System", text: "New phonecall initialized.", time: "Now" }]);
    setViewMode("form");
  };

  const handleOpenEdit = (c) => {
    setSelectedId(c.id);
    setStage(c.status || "Confirmed");

    const cust = custMap[c.customer_id];
    const veh = vehicles.find(v => v.id === c.vehicle_id);

    setFormData({
      date: c.created_at ? c.created_at.replace("T", " ").substring(0, 19) : "2026-09-03 12:11:41",
      direction: "In",
      call_type: c.call_type || "Inbound Call",
      sub_call_type: "General",
      agent: "Philip Ishak",
      customer_id: c.customer_id ? String(c.customer_id) : "",
      vehicle_id: c.vehicle_id ? String(c.vehicle_id) : "",
      chassis_number: veh?.vin || "VIN-8492049210",
      license_plate: veh?.plate_number || "",
      phone: cust?.phone || "",
      mobile: cust?.phone || "",
      campaign: "Q3 Campaign",
      priority: 2,
      duration: "02:15",
      summary: c.notes || ""
    });

    setLogs([{ id: Date.now(), user: "System", text: `Loaded Call #${c.id}`, time: "Just now" }]);
    setViewMode("form");
  };

  const handleCustomerChange = (cid) => {
    const cust = custMap[cid];
    setFormData({
      ...formData,
      customer_id: cid,
      phone: cust ? cust.phone : "",
      mobile: cust ? cust.phone : "",
      vehicle_id: ""
    });
  };

  const handleVehicleChange = (vid) => {
    const veh = vehicles.find(v => v.id === parseInt(vid));
    setFormData({
      ...formData,
      vehicle_id: vid,
      license_plate: veh ? veh.plate_number : "",
      chassis_number: veh ? (veh.vin || "VIN-8492049210") : ""
    });
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLog.trim()) return;
    setLogs([{ id: Date.now(), user: "Agent", text: newLog, time: "Just now" }, ...logs]);
    setNewLog("");
  };

  const handleSaveCall = async (targetStage) => {
    if (!formData.customer_id) {
      alert("Please select a customer first!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_id: Number(formData.customer_id),
        vehicle_id: formData.vehicle_id ? Number(formData.vehicle_id) : null,
        call_type: formData.call_type,
        status: targetStage || "Confirmed",
        notes: `[${formData.direction}] ${formData.summary || formData.sub_call_type}`
      };

      if (selectedId) {
        await api.patch(`/calls/${selectedId}`, payload).catch(() => api.put(`/calls/${selectedId}`, payload));
        alert(`Call #${selectedId} updated!`);
      } else {
        const res = await api.post("/calls", payload).catch(() => api.post("/calls/", payload));
        if (res?.data?.id) setSelectedId(res.data.id);
        alert("Phonecall logged successfully!");
      }

      setStage(targetStage);
      await loadAll();
    } catch (err) {
      console.error(err);
      alert("Error saving call: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const currentCustomerVehicles = vehicles.filter(v => v.customer_id === parseInt(formData.customer_id));
  const filteredCalls = callsList.filter(c => {
    const custName = custMap[c.customer_id]?.name?.toLowerCase() || "";
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white p-7 rounded-3xl shadow-xl shadow-slate-900/10">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-widest mb-1.5">
                    <PhoneCall size={16} />
                    <span>CRM & Call Center Operations</span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight">Phone Calls Desk</h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Log inbound and outbound client calls, schedule appointments, and inspect vehicle files
                  </p>
                </div>

                <button
                  onClick={handleOpenNew}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/30 transition"
                >
                  <Plus size={18} />
                  <span>Log New Phone Call</span>
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
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 pr-3">
                  Total Calls: <span className="text-amber-600 font-black">{filteredCalls.length}</span>
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-extrabold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Call ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Vehicle</th>
                        <th className="px-6 py-4">Call Purpose / Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCalls.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <PhoneCall size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-bold text-slate-600">No phone calls registered</p>
                          </td>
                        </tr>
                      ) : (
                        filteredCalls.map((c) => {
                          const customer = custMap[c.customer_id];
                          return (
                            <tr 
                              key={c.id} 
                              onClick={() => handleOpenEdit(c)}
                              className="hover:bg-amber-50/40 cursor-pointer transition"
                            >
                              <td className="px-6 py-4 font-mono font-black text-amber-600">
                                #{c.id}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-extrabold text-slate-800">{customer?.name || "Client"}</div>
                                <div className="text-[11px] text-slate-400">{customer?.phone}</div>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-700">
                                {vehMap[c.vehicle_id] || "No Vehicle"}
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-700">
                                {c.call_type || "General Inquiry"}
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                                  {c.status || "Confirmed"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-amber-600 font-bold text-xs inline-flex items-center gap-1">
                                  Open <ChevronRight size={14} />
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
                    <ArrowLeft size={15} /> Back to Desk
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveCall(stage)}
                    disabled={loading}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                  >
                    <Save size={15} /> {selectedId ? "Save Changes" : "Save Call"}
                  </button>

                  <button
                    onClick={() => navigate("/vehicles")}
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 transition"
                  >
                    <Car size={14} className="text-amber-600" /> Create Vehicle
                  </button>

                  <button
                    onClick={() => navigate("/appointments", { 
                      state: { customer_id: formData.customer_id, vehicle_id: formData.vehicle_id } 
                    })}
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 transition"
                  >
                    <Calendar size={14} className="text-blue-600" /> Appointments
                  </button>

                  <button
                    onClick={() => navigate("/tickets", { 
                      state: { customer_id: formData.customer_id, vehicle_id: formData.vehicle_id, call_summary: formData.summary } 
                    })}
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 transition"
                  >
                    <TicketCheck size={14} className="text-rose-600" /> Helpdesk Tickets
                  </button>
                </div>

                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 p-1 text-xs font-bold">
                  {["Confirmed", "Cancelled", "Pending", "Held"].map((st) => (
                    <div
                      key={st}
                      onClick={() => handleSaveCall(st)}
                      className={`cursor-pointer px-3.5 py-1.5 rounded-lg transition ${
                        stage === st
                          ? "bg-white text-amber-600 shadow-sm font-extrabold border border-slate-200"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {st}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                <div className="xl:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 space-y-7">
                  
                  <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-600 tracking-wider">
                        {selectedId ? `Phone Call Log #${selectedId}` : "New Logged Call"}
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-0.5">
                        {formData.call_type}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl">
                      <span className="text-[11px] font-bold text-amber-900">In regard to:</span>
                      <button onClick={() => navigate("/appointments")} className="text-[10px] font-black bg-white px-2 py-0.5 rounded-lg border border-amber-200 text-blue-600 shadow-sm">
                        Appointments
                      </button>
                      <button onClick={() => navigate("/tickets")} className="text-[10px] font-black bg-white px-2 py-0.5 rounded-lg border border-amber-200 text-rose-600 shadow-sm">
                        Tickets
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Date & Time</label>
                        <input
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Direction</label>
                        <div className="flex items-center gap-6 pt-1 text-xs font-semibold text-slate-700">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="direction"
                              checked={formData.direction === "In"}
                              onChange={() => setFormData({ ...formData, direction: "In" })}
                              className="text-amber-600 focus:ring-amber-500"
                            />
                            Inbound (In)
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="direction"
                              checked={formData.direction === "Out"}
                              onChange={() => setFormData({ ...formData, direction: "Out" })}
                              className="text-amber-600 focus:ring-amber-500"
                            />
                            Outbound (Out)
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Phone Call Type</label>
                        <select
                          value={formData.call_type}
                          onChange={(e) => setFormData({ ...formData, call_type: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value="Periodic Maintenance Inquiry">Periodic Maintenance Inquiry</option>
                          <option value="Breakdown Assistance">Breakdown Assistance</option>
                          <option value="Warranty & Spare Parts">Warranty & Spare Parts</option>
                          <option value="General Followup">General Followup</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Sub Phone Call Type</label>
                        <input
                          value={formData.sub_call_type}
                          onChange={(e) => setFormData({ ...formData, sub_call_type: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Agent</label>
                        <input
                          value={formData.agent}
                          onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                        />
                      </div>

                      {/* استخدام نظام البحث الذكي للعملاء */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Customer / Contact *</label>
                        <SearchableSelect
                          options={customers}
                          value={formData.customer_id}
                          onChange={(val) => handleCustomerChange(val)}
                          placeholder="Search & select customer..."
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Campaign</label>
                        <input
                          value={formData.campaign}
                          onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Priority Rating</label>
                        <div className="flex items-center gap-1.5 pt-1">
                          {[1, 2, 3].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setFormData({ ...formData, priority: star })}
                              className={`p-1 transition ${formData.priority >= star ? "text-amber-500" : "text-slate-300"}`}
                            >
                              <Star size={20} fill={formData.priority >= star ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Duration (min)</label>
                        <input
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Selected Vehicle</label>
                        <select
                          value={formData.vehicle_id}
                          onChange={(e) => handleVehicleChange(e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value="">Choose vehicle...</option>
                          {currentCustomerVehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate_number})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Chassis Number</label>
                          <input
                            readOnly
                            value={formData.chassis_number}
                            placeholder="VIN-XXXX"
                            className="w-full text-xs font-mono font-bold px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">License Plate</label>
                          <input
                            readOnly
                            value={formData.license_plate}
                            placeholder="Plate #"
                            className="w-full text-xs font-mono font-bold px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / Phone</label>
                        <input
                          readOnly
                          value={formData.mobile}
                          placeholder="Phone number"
                          className="w-full text-xs font-bold px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("vehicles")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                          activeTab === "vehicles" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Vehicles Data
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("summary")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                          activeTab === "summary" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Call Summary & Notes
                      </button>
                    </div>

                    {activeTab === "vehicles" ? (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-600 font-extrabold uppercase text-[10px]">
                            <tr>
                              <th className="px-4 py-3">Brand</th>
                              <th className="px-4 py-3">Model</th>
                              <th className="px-4 py-3">Chassis Number</th>
                              <th className="px-4 py-3">License Plate</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {formData.vehicle_id ? (
                              <tr>
                                <td className="px-4 py-3">{vehMap[formData.vehicle_id]?.split(" ")[0]}</td>
                                <td className="px-4 py-3">{vehMap[formData.vehicle_id]?.split(" ")[1]}</td>
                                <td className="px-4 py-3 font-mono">{formData.chassis_number}</td>
                                <td className="px-4 py-3 font-mono">{formData.license_plate}</td>
                              </tr>
                            ) : (
                              <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-slate-400 font-bold">
                                  No vehicle linked to this call. Select a customer and vehicle above.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <textarea
                        rows={3}
                        placeholder="Write call discussion details..."
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    )}
                  </div>

                </div>

                <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                      <History size={16} className="text-amber-600" />
                      <span>Chatter & Activity Log</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      {logs.length} events
                    </span>
                  </div>

                  <form onSubmit={handleAddLog} className="relative">
                    <input
                      type="text"
                      placeholder="Log note or internal update..."
                      value={newLog}
                      onChange={(e) => setNewLog(e.target.value)}
                      className="w-full text-xs font-medium pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button type="submit" className="absolute right-2 top-2 p-1 text-slate-400 hover:text-amber-600">
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

export default Calls;