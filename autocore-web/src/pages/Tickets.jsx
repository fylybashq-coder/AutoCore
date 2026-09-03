import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";
import SearchableSelect from "../components/SearchableSelect";
import { 
  TicketCheck, 
  Send, 
  Save, 
  Plus, 
  History, 
  ArrowLeft, 
  Search, 
  Wrench, 
  Star, 
  Package, 
  ChevronRight
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Tickets() {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState("list"); // "list" | "form"
  const [ticketsList, setTicketsList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("New"); // New | In Progress | On Hold | Resolved
  const [activeTab, setActiveTab] = useState("description");

  // Form State
  const [formData, setFormData] = useState({
    subject: "Engine vibration under acceleration",
    ticket_type: "Customer Complaint",
    helpdesk_team: "Customer Care - Aftersales",
    customer_id: "",
    vehicle_id: "",
    chassis_number: "",
    license_plate: "",
    mobile: "",
    branch: "Cairo Main Workshop",
    channel: "Call Center",
    complaint_type: "Mechanical Issues",
    sub_complaint: "Engine Noise & Vibration",
    assigned_to: "Philip Ishak",
    priority: 2,
    description: "",
    part1_num: "",
    part1_order: "",
    part2_num: "",
    part2_order: ""
  });

  const [logs, setLogs] = useState([
    { id: 1, user: "System", text: "Ticket initialized.", time: "Now" }
  ]);
  const [newLog, setNewLog] = useState("");

  const loadAll = async () => {
    try {
      const [tRes, cRes, vRes] = await Promise.all([
        api.get("/tickets").catch(() => api.get("/tickets/")).catch(() => ({ data: [] })),
        api.get("/customers").catch(() => api.get("/customers/")).catch(() => ({ data: [] })),
        api.get("/vehicles").catch(() => api.get("/vehicles/")).catch(() => ({ data: [] }))
      ]);
      setTicketsList(Array.isArray(tRes.data) ? tRes.data : []);
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
      const targetCustomer = customers.find(c => c.id === parseInt(cId));

      setFormData(prev => ({
        ...prev,
        customer_id: cId,
        vehicle_id: vId,
        mobile: targetCustomer ? targetCustomer.phone : prev.mobile,
        license_plate: selectedVeh ? selectedVeh.plate_number : prev.license_plate,
        chassis_number: selectedVeh ? (selectedVeh.vin || "VIN-8492049210") : prev.chassis_number,
        description: location.state.call_summary ? `[From Call Center] ${location.state.call_summary}` : prev.description
      }));

      setLogs([{ id: Date.now(), user: "System", text: "Linked successfully with Call Center record.", time: "Now" }]);
    }
  }, [location.state, customers, vehicles]);

  const custMap = Object.fromEntries(customers.map(c => [c.id, c]));
  const vehMap = Object.fromEntries(vehicles.map(v => [v.id, `${v.brand} ${v.model} (${v.plate_number})`]));

  const handleOpenNew = () => {
    setSelectedId(null);
    setStage("New");
    setFormData({
      subject: "",
      ticket_type: "Customer Complaint",
      helpdesk_team: "Customer Care - Aftersales",
      customer_id: "",
      vehicle_id: "",
      chassis_number: "",
      license_plate: "",
      mobile: "",
      branch: "Cairo Main Workshop",
      channel: "Call Center",
      complaint_type: "Mechanical Issues",
      sub_complaint: "General Diagnosis",
      assigned_to: "Philip Ishak",
      priority: 2,
      description: "",
      part1_num: "",
      part1_order: "",
      part2_num: "",
      part2_order: ""
    });
    setLogs([{ id: 1, user: "System", text: "Draft ticket record opened.", time: "Now" }]);
    setViewMode("form");
  };

  const handleOpenEdit = (t) => {
    setSelectedId(t.id);
    setStage(t.status || "New");

    const cust = custMap[t.customer_id];
    const veh = vehicles.find(v => v.id === t.vehicle_id);

    setFormData({
      subject: t.subject || "",
      ticket_type: "Customer Complaint",
      helpdesk_team: "Customer Care - Aftersales",
      customer_id: t.customer_id ? String(t.customer_id) : "",
      vehicle_id: t.vehicle_id ? String(t.vehicle_id) : "",
      chassis_number: veh?.vin || "VIN-8492049210",
      license_plate: veh?.plate_number || "",
      mobile: cust?.phone || "",
      branch: "Cairo Main Workshop",
      channel: "Call Center",
      complaint_type: "Mechanical Issues",
      sub_complaint: "General Diagnosis",
      assigned_to: "Philip Ishak",
      priority: t.priority === "High" ? 3 : 2,
      description: t.description || "",
      part1_num: "",
      part1_order: "",
      part2_num: "",
      part2_order: ""
    });

    setLogs([{ id: Date.now(), user: "System", text: `Loaded ticket #${t.id}.`, time: "Just now" }]);
    setViewMode("form");
  };

  const handleCustomerChange = (cid) => {
    const cust = custMap[cid];
    setFormData({
      ...formData,
      customer_id: cid,
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
    setLogs([{ id: Date.now(), user: "Support Agent", text: newLog, time: "Just now" }, ...logs]);
    setNewLog("");
  };

  const handleSaveTicket = async (targetStage) => {
    if (!formData.customer_id) {
      alert("Please select a customer first!");
      return;
    }
    if (!formData.subject || !formData.subject.trim()) {
      alert("Please enter a ticket subject!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_id: Number(formData.customer_id),
        vehicle_id: formData.vehicle_id ? Number(formData.vehicle_id) : null,
        subject: formData.subject.trim(),
        description: formData.description || "",
        priority: Number(formData.priority) >= 3 ? "High" : "Normal",
        status: targetStage || "New"
      };

      if (selectedId) {
        await api.patch(`/tickets/${selectedId}`, payload).catch(() => api.put(`/tickets/${selectedId}`, payload));
        alert(`Ticket #${selectedId} updated!`);
      } else {
        const res = await api.post("/tickets", payload).catch(() => api.post("/tickets/", payload));
        if (res?.data?.id) setSelectedId(res.data.id);
        alert("Ticket created successfully!");
      }

      setStage(targetStage);
      await loadAll();
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEscalateToJob = async () => {
    if (!selectedId) {
      alert("Please save the ticket first before escalating to Workshop!");
      return;
    }
    try {
      await api.patch(`/tickets/${selectedId}/convert-to-job`);
      alert("Ticket escalated into a Workshop Job Card!");
      navigate("/job-cards");
    } catch (err) {
      alert("Conversion failed: " + err.message);
    }
  };

  const currentCustomerVehicles = vehicles.filter(v => v.customer_id === parseInt(formData.customer_id));
  const filteredTickets = ticketsList.filter(t => {
    const custName = custMap[t.customer_id]?.name?.toLowerCase() || "";
    const subj = (t.subject || "").toLowerCase();
    return custName.includes(search.toLowerCase()) || subj.includes(search.toLowerCase());
  });

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800" dir="ltr">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 flex-1 flex flex-col space-y-4 max-w-[1700px] w-full mx-auto">
          
          {viewMode === "list" ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white p-7 rounded-3xl shadow-xl shadow-slate-900/10">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-widest mb-1.5">
                    <TicketCheck size={16} />
                    <span>Helpdesk & Customer Care</span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight">Support Tickets Desk</h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Track warranty complaints, spare parts requests, and escalations to workshop
                  </p>
                </div>

                <button
                  onClick={handleOpenNew}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-rose-600/30 transition"
                >
                  <Plus size={18} />
                  <span>Raise New Ticket</span>
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="relative w-96">
                  <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by ticket subject or client..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 pr-3">
                  Total Tickets: <span className="text-rose-600 font-black">{filteredTickets.length}</span>
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-extrabold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Ticket Ref</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Vehicle Specs</th>
                        <th className="px-6 py-4">Subject & Complaint</th>
                        <th className="px-6 py-4">Priority</th>
                        <th className="px-6 py-4">Stage</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <TicketCheck size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-bold text-slate-600">No support tickets found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredTickets.map((t) => {
                          const customer = custMap[t.customer_id];
                          return (
                            <tr 
                              key={t.id} 
                              onClick={() => handleOpenEdit(t)}
                              className="hover:bg-rose-50/40 cursor-pointer transition"
                            >
                              <td className="px-6 py-4 font-mono font-black text-rose-600">
                                {t.ticket_number || `TCK-00${t.id}`}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-extrabold text-slate-800">{customer?.name || "Client"}</div>
                                <div className="text-[11px] text-slate-400">{customer?.phone}</div>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-700">
                                {vehMap[t.vehicle_id] || "General Account"}
                              </td>
                              <td className="px-6 py-4 max-w-sm">
                                <div className="font-bold text-slate-800 truncate">{t.subject}</div>
                                <div className="text-[11px] text-slate-500 truncate">{t.description || "No notes"}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  t.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                                }`}>
                                  {t.priority || "Normal"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                                  t.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                  t.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                  "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                  {t.status || "New"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-rose-600 font-bold text-xs inline-flex items-center gap-1">
                                  Review <ChevronRight size={14} />
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
                    onClick={() => handleSaveTicket(stage)}
                    disabled={loading}
                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition cursor-pointer disabled:opacity-50"
                  >
                    <Save size={15} /> {loading ? "Saving..." : selectedId ? "Save Changes" : "Create Ticket"}
                  </button>

                  <button
                    onClick={handleEscalateToJob}
                    className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-blue-200 transition"
                  >
                    <Wrench size={14} /> Convert to Job Card
                  </button>
                </div>

                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 p-1 text-xs font-bold">
                  {["New", "In Progress", "On Hold", "Resolved"].map((st) => (
                    <div
                      key={st}
                      onClick={() => handleSaveTicket(st)}
                      className={`cursor-pointer px-3.5 py-1.5 rounded-lg transition ${
                        stage === st
                          ? "bg-white text-rose-600 shadow-sm font-extrabold border border-slate-200"
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
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[11px] font-black uppercase text-rose-600 tracking-wider">
                      {selectedId ? `Ticket #${selectedId}` : "New Helpdesk Ticket"}
                    </span>
                    <input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Product arrived damaged / Unusual engine noise"
                      className="w-full text-2xl font-black text-slate-900 border-none outline-none focus:ring-0 placeholder:text-slate-300 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Ticket Type</label>
                        <select
                          value={formData.ticket_type}
                          onChange={(e) => setFormData({ ...formData, ticket_type: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value="Customer Complaint">Customer Complaint</option>
                          <option value="Warranty Claim">Warranty Claim</option>
                          <option value="Roadside Assistance">Roadside Assistance</option>
                          <option value="Spare Parts Inquiry">Spare Parts Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Helpdesk Team</label>
                        <input
                          readOnly
                          value={formData.helpdesk_team}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Customer *</label>
                        <SearchableSelect
                          options={customers}
                          value={formData.customer_id}
                          onChange={(val) => handleCustomerChange(val)}
                          placeholder="Search & select customer..."
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle</label>
                        <select
                          value={formData.vehicle_id}
                          onChange={(e) => handleVehicleChange(e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value="">Choose Vehicle...</option>
                          {currentCustomerVehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate_number})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Chassis / VIN</label>
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
                            placeholder="Plate"
                            className="w-full text-xs font-mono font-bold px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                        <input
                          readOnly
                          value={formData.mobile}
                          placeholder="Phone number"
                          className="w-full text-xs font-bold px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Workshop Branch</label>
                        <input
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Intake Channel</label>
                        <select
                          value={formData.channel}
                          onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value="Call Center">Call Center (Inbound)</option>
                          <option value="Workshop Reception">Workshop Reception</option>
                          <option value="WhatsApp / Website">WhatsApp / Online Portal</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Complaint Type</label>
                        <select
                          value={formData.complaint_type}
                          onChange={(e) => setFormData({ ...formData, complaint_type: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <option value="Mechanical Issues">Mechanical Issues</option>
                          <option value="Electrical & Diagnostics">Electrical & Diagnostics</option>
                          <option value="Body & Paint Service">Body & Paint Service</option>
                          <option value="Delayed Delivery">Delayed Delivery / Billing</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Sub Complaint</label>
                        <input
                          value={formData.sub_complaint}
                          onChange={(e) => setFormData({ ...formData, sub_complaint: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Support Agent</label>
                        <input
                          value={formData.assigned_to}
                          onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
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
                          <span className="text-xs font-bold text-slate-400 ml-2">
                            {formData.priority === 3 ? "Urgent / High" : formData.priority === 2 ? "Normal" : "Low"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Package size={14} /> Requested Spare Parts
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex gap-2">
                        <input
                          placeholder="Part 1 Number"
                          value={formData.part1_num}
                          onChange={(e) => setFormData({ ...formData, part1_num: e.target.value })}
                          className="flex-1 text-xs font-mono font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                        <input
                          placeholder="Order #"
                          value={formData.part1_order}
                          onChange={(e) => setFormData({ ...formData, part1_order: e.target.value })}
                          className="w-28 text-xs font-mono font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div className="flex gap-2">
                        <input
                          placeholder="Part 2 Number"
                          value={formData.part2_num}
                          onChange={(e) => setFormData({ ...formData, part2_num: e.target.value })}
                          className="flex-1 text-xs font-mono font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                        <input
                          placeholder="Order #"
                          value={formData.part2_order}
                          onChange={(e) => setFormData({ ...formData, part2_order: e.target.value })}
                          className="w-28 text-xs font-mono font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("description")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          activeTab === "description" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Description & Symptoms
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Add details about customer complaint..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                </div>

                <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                      <History size={16} className="text-rose-600" />
                      <span>Chatter & Activity Log</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      {logs.length} updates
                    </span>
                  </div>

                  <form onSubmit={handleAddLog} className="relative">
                    <input
                      type="text"
                      placeholder="Post update..."
                      value={newLog}
                      onChange={(e) => setNewLog(e.target.value)}
                      className="w-full text-xs font-medium pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button type="submit" className="absolute right-2 top-2 p-1 text-slate-400 hover:text-rose-600">
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

export default Tickets;