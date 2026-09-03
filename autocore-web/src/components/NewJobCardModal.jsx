import { useState, useEffect } from "react";
import { X, Wrench } from "lucide-react";
import api from "../services/api";

function NewJobCardModal({ isOpen, onClose, onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    vehicle_id: "",
    current_km: "",
    fuel_level: "50%",
    advisor_name: "Philip (Advisor)",
    technician_name: "Mahmoud (Tech)",
    service_type: "Periodic Maintenance",
    customer_complaint: "",
    labor_cost: 0,
    parts_cost: 0,
  });

  useEffect(() => {
    if (isOpen) {
      api.get("/customers").then((res) => setCustomers(res.data)).catch(console.error);
      api.get("/vehicles").then((res) => setVehicles(res.data)).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/job-cards/", {
        ...formData,
        customer_id: parseInt(formData.customer_id),
        vehicle_id: parseInt(formData.vehicle_id),
        current_km: parseInt(formData.current_km),
        labor_cost: parseFloat(formData.labor_cost) || 0,
        parts_cost: parseFloat(formData.parts_cost) || 0,
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to create Job Card: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <Wrench size={18} />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">New Work Order (Reception Check-in)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Customer</label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle</label>
              <select
                required
                value={formData.vehicle_id}
                onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.plate_number})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Mileage (KM)</label>
              <input
                type="number"
                required
                placeholder="e.g. 45000"
                value={formData.current_km}
                onChange={(e) => setFormData({ ...formData, current_km: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fuel Level</label>
              <select
                value={formData.fuel_level}
                onChange={(e) => setFormData({ ...formData, fuel_level: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="25%">25% (Low)</option>
                <option value="50%">50% (Half)</option>
                <option value="75%">75% (Good)</option>
                <option value="100%">100% (Full)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Service Type</label>
              <input
                type="text"
                required
                placeholder="Periodic Maintenance"
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Customer Complaint / Scope</label>
            <textarea
              rows={2}
              placeholder="Brake squeaking sound, oil replacement requested..."
              value={formData.customer_complaint}
              onChange={(e) => setFormData({ ...formData, customer_complaint: e.target.value })}
              className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Labor Cost ($)</label>
              <input
                type="number"
                value={formData.labor_cost}
                onChange={(e) => setFormData({ ...formData, labor_cost: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Parts Cost ($)</label>
              <input
                type="number"
                value={formData.parts_cost}
                onChange={(e) => setFormData({ ...formData, parts_cost: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Open Job Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewJobCardModal;