import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";
import { 
  Users, 
  Search, 
  Plus, 
  Save, 
  ArrowLeft, 
  History, 
  Send, 
  Car, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Customers() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list"); // "list" | "form"
  const [customersList, setCustomersList] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("vehicles");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "Cairo, Egypt",
    company: "Individual Client",
    tax_id: "",
    notes: ""
  });

  const [logs, setLogs] = useState([
    { id: 1, user: "System", text: "Customer file initialized.", time: "Now" }
  ]);
  const [newLog, setNewLog] = useState("");

  const loadAll = async () => {
    try {
      const [cRes, vRes] = await Promise.all([
        api.get("/customers").catch(() => api.get("/customers/")).catch(() => ({ data: [] })),
        api.get("/vehicles").catch(() => api.get("/vehicles/")).catch(() => ({ data: [] }))
      ]);
      setCustomersList(Array.isArray(cRes.data) ? cRes.data : []);
      setVehicles(Array.isArray(vRes.data) ? vRes.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleOpenNew = () => {
    setSelectedId(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "Cairo, Egypt",
      company: "Individual Client",
      tax_id: "",
      notes: ""
    });
    setLogs([{ id: 1, user: "System", text: "New customer form opened.", time: "Now" }]);
    setViewMode("form");
  };

  const handleOpenEdit = (c) => {
    setSelectedId(c.id);
    setFormData({
      name: c.name || "",
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "Cairo, Egypt",
      company: c.company || "Individual Client",
      tax_id: c.tax_id || "",
      notes: c.notes || ""
    });
    setLogs([{ id: Date.now(), user: "System", text: `Loaded customer file #${c.id}`, time: "Just now" }]);
    setViewMode("form");
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLog.trim()) return;
    setLogs([{ id: Date.now(), user: "Advisor", text: newLog, time: "Just now" }, ...logs]);
    setNewLog("");
  };

  const handleSaveCustomer = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please enter customer name and phone number!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email || "",
        address: formData.address || ""
      };

      if (selectedId) {
        await api.patch(`/customers/${selectedId}`, payload).catch(() => api.put(`/customers/${selectedId}`, payload));
        alert(`Customer #${selectedId} updated successfully!`);
      } else {
        const res = await api.post("/customers", payload).catch(() => api.post("/customers/", payload));
        if (res?.data?.id) setSelectedId(res.data.id);
        alert("New customer created successfully!");
      }

      await loadAll();
    } catch (err) {
      alert("Error saving customer: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const customerVehicles = vehicles.filter(v => v.customer_id === selectedId);
  const filteredCustomers = customersList.filter(c => 
    (c.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (c.phone || "").includes(search)
  );

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800" dir="ltr">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 flex-1 flex flex-col space-y-4 max-w-[1700px] w-full mx-auto">
          
          {viewMode === "list" ? (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-7 rounded-3xl shadow-xl shadow-slate-900/10">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest mb-1.5">
                    <Users size={16} />
                    <span>CRM & Client Directory</span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight">Customers Management</h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Manage client profiles, contact numbers, and inspect linked vehicles
                  </p>
                </div>

                <button
                  onClick={handleOpenNew}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/30 transition"
                >
                  <Plus size={18} />
                  <span>Create Customer</span>
                </button>
              </div>

              {/* Search Control */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="relative w-96">
                  <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by client name or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 pr-3">
                  Total Clients: <span className="text-emerald-600 font-black">{filteredCustomers.length}</span>
                </span>
              </div>

              {/* Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-extrabold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">ID #</th>
                        <th className="px-6 py-4">Client Name</th>
                        <th className="px-6 py-4">Phone Number</th>
                        <th className="px-6 py-4">Email Address</th>
                        <th className="px-6 py-4">Address</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <Users size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-bold text-slate-600">No customers registered</p>
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((c) => (
                          <tr 
                            key={c.id} 
                            onClick={() => handleOpenEdit(c)}
                            className="hover:bg-emerald-50/40 cursor-pointer transition"
                          >
                            <td className="px-6 py-4 font-mono font-black text-emerald-600">
                              #{c.id}
                            </td>
                            <td className="px-6 py-4 font-extrabold text-slate-800">
                              {c.name}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-600 flex items-center gap-1">
                              <Phone size={13} className="text-slate-400" /> {c.phone}
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">
                              {c.email || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {c.address || "Cairo, Egypt"}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-slate-400 hover:text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                                Open File <ChevronRight size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (

            /* Form View (Odoo Style) */
            <div className="space-y-4">
              <div className="bg-white px-6 py-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition"
                  >
                    <ArrowLeft size={15} /> Back to Directory
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCustomer}
                    disabled={loading}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
                  >
                    <Save size={15} /> {selectedId ? "Save Changes" : "Create Customer"}
                  </button>

                  <button
                    onClick={() => navigate("/vehicles", { state: { customer_id: selectedId } })}
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 transition"
                  >
                    <Car size={14} className="text-emerald-600" /> Register Vehicle
                  </button>
                </div>

                <span className="text-xs font-extrabold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  {selectedId ? `Client Record #${selectedId}` : "New Client Draft"}
                </span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Form Sheet (8 Cols) */}
                <div className="xl:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 space-y-7">
                  
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[11px] font-black uppercase text-emerald-600 tracking-wider">
                      Customer Profile
                    </span>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Philip Ishak"
                      className="w-full text-2xl font-black text-slate-900 border-none outline-none focus:ring-0 placeholder:text-slate-300 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                        <input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 01275372423"
                          className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                        <input
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="client@autocore.com"
                          className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Physical Address</label>
                        <input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Company / Segment</label>
                        <input
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Linked Vehicles Tab Section */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white"
                      >
                        Registered Vehicles ({customerVehicles.length})
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-extrabold uppercase text-[10px]">
                          <tr>
                            <th className="px-4 py-3">Brand & Model</th>
                            <th className="px-4 py-3">Plate Number</th>
                            <th className="px-4 py-3">Chassis / VIN</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {customerVehicles.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="px-4 py-6 text-center text-slate-400 font-bold">
                                No vehicles registered for this client yet.
                              </td>
                            </tr>
                          ) : (
                            customerVehicles.map(v => (
                              <tr key={v.id}>
                                <td className="px-4 py-3 font-extrabold text-slate-800">{v.brand} {v.model}</td>
                                <td className="px-4 py-3 font-mono">{v.plate_number}</td>
                                <td className="px-4 py-3 font-mono">{v.vin || "VIN-849204"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Right Chatter */}
                <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                      <History size={16} className="text-emerald-600" />
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
                      className="w-full text-xs font-medium pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button type="submit" className="absolute right-2 top-2 p-1 text-slate-400 hover:text-emerald-600">
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

export default Customers;