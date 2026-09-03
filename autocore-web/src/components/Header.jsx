import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, User } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by Plate / VIN / Phone..."
          className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user.full_name || "Admin"}
            </p>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {user.role || "Administrator"}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
            <User size={18} />
          </div>
          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ml-2"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;