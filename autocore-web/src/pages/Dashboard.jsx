import { useEffect, useState } from "react";
import {
  Users,
  CarFront,
  CalendarDays,
  PhoneCall,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Dashboard() {
  // الخطوة 2: تحديث الـ State الرئيسي ليدعم القوائم الديناميكية
  const [dashboard, setDashboard] = useState({
    customers: 0,
    vehicles: 0,
    appointments: 0,
    calls: 0,
    recent_customers: [],
    today_appointments: [],
  });

  const appointmentsData = [
    { day: "Mon", total: 5 },
    { day: "Tue", total: 8 },
    { day: "Wed", total: 3 },
    { day: "Thu", total: 10 },
    { day: "Fri", total: 6 },
    { day: "Sat", total: 4 },
    { day: "Sun", total: 2 },
  ];

  const vehicleData = [
    { name: "Suzuki", value: 12 },
    { name: "Toyota", value: 8 },
    { name: "Hyundai", value: 5 },
    { name: "Nissan", value: 4 },
  ];

  const COLORS = ["#2563EB", "#16A34A", "#EA580C", "#DC2626"];

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await api.get("/dashboard/stats");
      // الخطوة 3: تعيين البيانات في dashboard
      setDashboard(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <Header />
        </div>

        <div className="p-8">
          {/* Header Title Section */}
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">
              Welcome to AutoCore DMS 👋
            </h1>
            <p className="text-gray-500 text-lg mt-2 font-medium">
              Customer Relationship & Dealer Management System
            </p>
            <p className="text-gray-400 mt-1 text-sm font-semibold">{today}</p>
          </div>

          {/* Key Metrics Cards - الخطوة 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Customers */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg p-6 text-white flex justify-between items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-blue-100 text-lg font-medium">Customers</p>
                <h2 className="text-5xl font-extrabold mt-3">
                  {dashboard.customers}
                </h2>
              </div>
              <Users size={60} className="opacity-30" />
            </div>

            {/* Vehicles */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl shadow-lg p-6 text-white flex justify-between items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-emerald-100 text-lg font-medium">Vehicles</p>
                <h2 className="text-5xl font-extrabold mt-3">
                  {dashboard.vehicles}
                </h2>
              </div>
              <CarFront size={60} className="opacity-30" />
            </div>

            {/* Appointments */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl shadow-lg p-6 text-white flex justify-between items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-orange-100 text-lg font-medium">
                  Appointments
                </p>
                <h2 className="text-5xl font-extrabold mt-3">
                  {dashboard.appointments}
                </h2>
              </div>
              <CalendarDays size={60} className="opacity-30" />
            </div>

            {/* Open Calls */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-500 rounded-2xl shadow-lg p-6 text-white flex justify-between items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div>
                <p className="text-rose-100 text-lg font-medium">Open Calls</p>
                <h2 className="text-5xl font-extrabold mt-3">
                  {dashboard.calls}
                </h2>
              </div>
              <PhoneCall size={60} className="opacity-30" />
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Appointments Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Appointments This Week
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentsData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="total"
                      fill="#2563EB"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vehicles By Brand */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Vehicles By Brand
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehicleData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {vehicleData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Customers - الخطوة 5 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Recent Customers
              </h2>

              <div className="space-y-4">
                {dashboard.recent_customers && dashboard.recent_customers.length > 0 ? (
                  dashboard.recent_customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex justify-between items-center border-b border-slate-100 pb-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{customer.name}</p>
                        <p className="text-gray-500 text-sm">
                          {customer.mobile}
                        </p>
                      </div>

                      <span className="text-gray-400 font-mono text-sm">
                        #{customer.id}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">No recent customers found</p>
                )}
              </div>
            </div>

            {/* Today's Appointments - الخطوة 6 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Today's Appointments
              </h2>

              <div className="space-y-4">
                {dashboard.today_appointments && dashboard.today_appointments.length > 0 ? (
                  dashboard.today_appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex justify-between items-center border-b border-slate-100 pb-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {appointment.service_type}
                        </p>

                        <p className="text-gray-500 text-sm">
                          {appointment.status}
                        </p>
                      </div>

                      <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">
                        {appointment.appointment_time}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">No appointments scheduled for today</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;