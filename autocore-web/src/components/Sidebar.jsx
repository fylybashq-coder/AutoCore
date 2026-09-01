import {
  LayoutDashboard,
  Users,
  Car,
  Calendar,
  Phone,
  Ticket,
  Shield,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen sticky top-0 shadow-2xl">

      {/* Logo */}

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-3xl font-extrabold text-blue-400">
          AutoCore
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Dealer Management System
        </p>

      </div>

      {/* Menu */}

      <nav className="mt-6 flex flex-col gap-2 px-3">

        <MenuItem
          to="/"
          icon={<LayoutDashboard size={20} />}
          title="Dashboard"
        />

        <MenuItem
          to="/customers"
          icon={<Users size={20} />}
          title="Customers"
        />

        <MenuItem
          to="/vehicles"
          icon={<Car size={20} />}
          title="Vehicles"
        />

        <MenuItem
          to="/appointments"
          icon={<Calendar size={20} />}
          title="Appointments"
        />

        <MenuItem
          to="/calls"
          icon={<Phone size={20} />}
          title="Calls"
        />

        <MenuItem
          to="/tickets"
          icon={<Ticket size={20} />}
          title="Tickets"
        />

        <MenuItem
          to="/users"
          icon={<Shield size={20} />}
          title="Users"
        />

      </nav>

      {/* Footer */}

      <div className="absolute bottom-0 w-64 border-t border-slate-700 p-5">

        <p className="text-xs text-gray-500">
          AutoCore DMS
        </p>

        <p className="text-xs text-gray-600">
          Version 1.0
        </p>

      </div>

    </aside>
  );
}

function MenuItem({ icon, title, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200
        ${
          isActive
            ? "bg-blue-600 shadow-lg"
            : "hover:bg-slate-800 hover:translate-x-1"
        }`
      }
    >
      {icon}

      <span className="font-medium">
        {title}
      </span>
    </NavLink>
  );
}

export default Sidebar;