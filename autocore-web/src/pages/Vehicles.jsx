import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CarFront, Plus, Gauge } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../services/api";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/vehicles")
      .then((res) => setVehicles(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="p-8 flex-1">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Vehicles Fleet
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage registered customer vehicles
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500">
              Loading vehicles...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <Link key={v.id} to={`/vehicles/${v.id}`} className="block group">
                  <div className="bg-white rounded-2xl shadow p-6 border border-slate-200 group-hover:shadow-xl group-hover:border-blue-300 group-hover:-translate-y-1 transition duration-300 cursor-pointer">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                          <CarFront size={28} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition">
                            {v.brand} {v.model}
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold">
                            {v.model_year || v.year || "N/A"} Model
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-slate-100 text-slate-800 font-mono font-bold rounded-lg text-xs">
                        {v.plate_number || "No Plate"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-400">Current KM:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {v.current_km ? `${v.current_km.toLocaleString()} KM` : "0 KM"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vehicles;