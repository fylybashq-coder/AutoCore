import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Wrench, 
  Calendar, 
  PhoneCall, 
  TicketCheck 
} from "lucide-react";

function Sidebar() {
  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/vehicles", label: "Vehicles", icon: Car },
    { to: "/job-cards", label: "Job Cards", icon: Wrench },
    { to: "/appointments", label: "Appointments", icon: Calendar },
    { to: "/calls", label: "Calls", icon: PhoneCall },
    { to: "/tickets", label: "Tickets", icon: TicketCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-4 shrink-0">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wrench size={22} className="text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-base tracking-tight">AutoCore DMS</h2>
            <p className="text-[11px] text-slate-400">Workshop & Service Ops</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-800 text-center">
        <p className="text-[11px] font-bold text-slate-300">Workshop Active</p>
        <p className="text-[10px] text-slate-500 mt-0.5">AutoCore v1.0.0 (Production)</p>
      </div>
    </aside>
  );
}

export default Sidebar;