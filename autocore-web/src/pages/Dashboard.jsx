import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";
import { 
  Wrench, 
  Car, 
  Users, 
  PhoneCall, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    customersCount: 0,
    vehiclesCount: 0,
    activeJobsCount: 0,
    totalRevenue: 0,
    pendingCallsCount: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [pendingCalls, setPendingCalls] = useState([]);
  const [customersMap, setCustomersMap] = useState({});
  const [vehiclesMap, setVehiclesMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [jobsRes, callsRes, custRes, vehRes] = await Promise.all([
        api.get("/job-cards/").catch(() => api.get("/job-cards")).catch(() => ({ data: [] })),
        api.get("/calls/").catch(() => api.get("/calls")).catch(() => ({ data: [] })),
        api.get("/customers/").catch(() => api.get("/customers")).catch(() => ({ data: [] })),
        api.get("/vehicles/").catch(() => api.get("/vehicles")).catch(() => ({ data: [] }))
      ]);

      const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
      const calls = Array.isArray(callsRes.data) ? callsRes.data : [];
      const customers = Array.isArray(custRes.data) ? custRes.data : [];
      const vehicles = Array.isArray(vehRes.data) ? vehRes.data : [];

      // خريطة أسماء العملاء والسيارات للربط السريع
      const cMap = Object.fromEntries(customers.map(c => [c.id, c.name]));
      const vMap = Object.fromEntries(vehicles.map(v => [v.id, `${v.brand} ${v.model} (${v.plate_number})`]));
      setCustomersMap(cMap);
      setVehiclesMap(vMap);

      // حساب الإحصائيات
      const activeJobs = jobs.filter(j => j.status !== "Delivered" && j.status !== "Cancelled");
      const revenue = jobs.reduce((acc, j) => acc + (Number(j.labor_cost) || 0) + (Number(j.parts_cost) || 0), 0);
      const pendingFollowUps = calls.filter(c => c.status === "Scheduled" || c.status === "Pending");

      setStats({
        customersCount: customers.length,
        vehiclesCount: vehicles.length,
        activeJobsCount: activeJobs.length,
        totalRevenue: revenue,
        pendingCallsCount: pendingFollowUps.length,
      });

      setRecentJobs(jobs.slice(0, 5));
      setPendingCalls(pendingFollowUps.slice(0, 5));
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Opened":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">Opened</span>;
      case "In Progress":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>;
      case "Completed":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case "Delivered":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-300">Delivered</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-50 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen" dir="ltr">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="p-8 flex-1 space-y-6 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-7 rounded-3xl shadow-xl shadow-slate-950/10">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest mb-1.5">
                <TrendingUp size={16} />
                <span>Live Workshop Operations</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">Executive Workshop Overview</h1>
              <p className="text-slate-400 text-xs mt-1">
                Real-time tracking of active bays, technicians workload, revenue, and customer communications
              </p>
            </div>
            
            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                to="/job-cards"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 transition"
              >
                <Wrench size={16} />
                <span>Open Job Card</span>
              </Link>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Active Jobs */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Bays</span>
                <span className="text-3xl font-black text-slate-800 mt-1 block">
                  {loading ? "..." : stats.activeJobsCount}
                </span>
                <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-1">
                  <Clock size={12} /> Under Maintenance
                </p>
              </div>
              <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center p-3.5">
                <Wrench size={24} />
              </div>
            </div>

            {/* Total Fleet */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registered Fleet</span>
                <span className="text-3xl font-black text-slate-800 mt-1 block">
                  {loading ? "..." : stats.vehiclesCount}
                </span>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                  <ShieldCheck size={12} /> Across {stats.customersCount} Clients
                </p>
              </div>
              <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center p-3.5">
                <Car size={24} />
              </div>
            </div>

            {/* Pending Calls */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Follow-up Calls</span>
                <span className="text-3xl font-black text-slate-800 mt-1 block">
                  {loading ? "..." : stats.pendingCallsCount}
                </span>
                <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                  <PhoneCall size={12} /> PSFU & Service Due
                </p>
              </div>
              <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center p-3.5">
                <PhoneCall size={24} />
              </div>
            </div>

            {/* Estimated Revenue */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                <span className="text-3xl font-black text-slate-800 mt-1 block">
                  {loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
                </span>
                <p className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 mt-1">
                  <DollarSign size={12} /> Labor & Spare Parts
                </p>
              </div>
              <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center p-3.5">
                <DollarSign size={24} />
              </div>
            </div>
          </div>

          {/* Operational Sections: Recent Jobs & Pending Calls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Live Workshop Floor (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">Recent Job Orders</h3>
                  <p className="text-[11px] text-slate-400">Current active repair & maintenance orders</p>
                </div>
                <Link to="/job-cards" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View All <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Order</th>
                      <th className="px-6 py-3.5">Customer / Vehicle</th>
                      <th className="px-6 py-3.5">Service Type</th>
                      <th className="px-6 py-3.5">Total Cost</th>
                      <th className="px-6 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                          Loading operations...
                        </td>
                      </tr>
                    ) : recentJobs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No job cards available.
                        </td>
                      </tr>
                    ) : (
                      recentJobs.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-6 py-4 font-mono font-black text-blue-600">
                            {j.job_number || `#JC-00${j.id}`}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-extrabold text-slate-800">{customersMap[j.customer_id] || "Client"}</div>
                            <div className="text-[11px] text-slate-400">{vehiclesMap[j.vehicle_id] || "Vehicle"}</div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-600">
                            {j.service_type || "Maintenance"}
                          </td>
                          <td className="px-6 py-4 font-black text-slate-800">
                            ${(Number(j.labor_cost) || 0) + (Number(j.parts_cost) || 0)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {getStatusBadge(j.status)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Follow-up Queue (1 Col) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">Calls Queue</h3>
                  <p className="text-[11px] text-slate-400">Automated post-service follow-ups</p>
                </div>
                <Link to="/calls" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Open CRM <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {loading ? (
                  <p className="text-center text-slate-400 py-6 text-xs">Loading queue...</p>
                ) : pendingCalls.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <CheckCircle2 size={30} className="mx-auto text-emerald-400 mb-2" />
                    <p className="text-xs font-bold text-slate-600">Queue is clear</p>
                    <p className="text-[10px]">All PSFU follow-ups completed.</p>
                  </div>
                ) : (
                  pendingCalls.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          {c.call_type || "PSFU"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {c.scheduled_date ? new Date(c.scheduled_date).toLocaleDateString() : "Pending"}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-1">
                        {customersMap[c.customer_id] || "Customer"}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {c.notes || "Follow-up regarding workshop delivery."}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;