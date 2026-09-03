import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import NewJobCardModal from "../components/NewJobCardModal";
import api from "../services/api";
import { Plus, Clock, CheckCircle2, ChevronRight, Fuel, Gauge, DollarSign } from "lucide-react";

function JobCards() {
  const [jobCards, setJobCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchJobCards = async () => {
    try {
      setLoading(true);
      const res = await api.get("/job-cards/");
      setJobCards(res.data);
    } catch (err) {
      console.error("Error fetching job cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobCards();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/job-cards/${id}/status`, { status: newStatus });
      fetchJobCards();
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.detail || err.message));
    }
  };

  const columns = [
    { key: "Opened", title: "Reception / Opened", color: "bg-slate-100 border-slate-200" },
    { key: "In Progress", title: "Bay In-Progress", color: "bg-blue-50 border-blue-200" },
    { key: "Quality Check", title: "Quality Check", color: "bg-amber-50 border-amber-200" },
    { key: "Delivered", title: "Completed & Delivered", color: "bg-emerald-50 border-emerald-200" },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-8 flex-1 overflow-x-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workshop Job Cards</h1>
              <p className="text-slate-500 text-xs mt-1">Live Workshop Bay Pipeline & Vehicle Service Status</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition"
            >
              <Plus size={16} />
              <span>New Work Order</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-6 items-start min-w-[1000px]">
            {columns.map((col) => {
              const cardsInCol = jobCards.filter((card) => card.status === col.key);
              return (
                <div key={col.key} className={`rounded-2xl border p-4 ${col.color}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">{col.title}</h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-sm border border-slate-200">
                      {cardsInCol.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {cardsInCol.map((card) => (
                      <div key={card.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            JC-#{card.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{card.service_type}</span>
                        </div>

                        <h3 className="font-extrabold text-slate-800 text-xs mb-1">
                          Vehicle #{card.vehicle_id}
                        </h3>
                        <p className="text-[11px] text-slate-500 mb-3 line-clamp-2">
                          {card.customer_complaint || "Routine maintenance and inspection"}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 mb-3 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            <Gauge size={12} className="text-slate-400" />
                            <span>{card.current_km.toLocaleString()} KM</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Fuel size={12} className="text-slate-400" />
                            <span>Fuel: {card.fuel_level}</span>
                          </div>
                          <div className="flex items-center gap-1 col-span-2">
                            <DollarSign size={12} className="text-emerald-600" />
                            <span className="font-bold text-slate-700">
                              Total: ${((card.labor_cost || 0) + (card.parts_cost || 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100">
                          {card.status === "Opened" && (
                            <button
                              onClick={() => handleUpdateStatus(card.id, "In Progress")}
                              className="w-full flex items-center justify-center gap-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition"
                            >
                              <span>Start Bay Work</span>
                              <ChevronRight size={12} />
                            </button>
                          )}
                          {card.status === "In Progress" && (
                            <button
                              onClick={() => handleUpdateStatus(card.id, "Quality Check")}
                              className="w-full flex items-center justify-center gap-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition"
                            >
                              <span>Send to QC</span>
                              <ChevronRight size={12} />
                            </button>
                          )}
                          {card.status === "Quality Check" && (
                            <button
                              onClick={() => handleUpdateStatus(card.id, "Delivered")}
                              className="w-full flex items-center justify-center gap-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition"
                            >
                              <CheckCircle2 size={12} />
                              <span>Deliver Vehicle</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {cardsInCol.length === 0 && (
                      <div className="p-6 text-center text-slate-400 text-[11px] font-medium border border-dashed border-slate-200 rounded-xl">
                        No orders in this phase
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <NewJobCardModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchJobCards}
          />
        </main>
      </div>
    </div>
  );
}

export default JobCards;