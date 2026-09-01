import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Appointments() {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200 px-8 py-4" />

        <div className="p-8 flex-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Appointments
          </h1>

          <p className="text-gray-500 mt-2 font-medium">
            Appointments Management
          </p>
        </div>
      </div>
    </div>
  );
}

export default Appointments;