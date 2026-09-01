import { useState } from "react";
import api from "../services/api";

function AddCallForm({ customerId, vehicles, onSuccess }) {
  const [form, setForm] = useState({
    vehicle_id: "",
    call_type: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveCall = async () => {
    if (!form.call_type) {
      alert("Please enter call type");
      return;
    }

    try {
      await api.post("/calls/", {
        customer_id: customerId,
        vehicle_id: form.vehicle_id
          ? Number(form.vehicle_id)
          : null,
        call_type: form.call_type,
        notes: form.notes,
      });

      alert("Call saved successfully ✅");

      setForm({
        vehicle_id: "",
        call_type: "",
        notes: "",
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to save call ❌");
    }
  };

  return (
    <div className="border rounded-xl p-5 mt-6 bg-gray-50">

      <h3 className="text-xl font-bold mb-4">
        New Call
      </h3>

      <select
        name="vehicle_id"
        value={form.vehicle_id}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-3"
      >
        <option value="">No Vehicle</option>

        {vehicles.map((vehicle) => (
          <option
            key={vehicle.id}
            value={vehicle.id}
          >
            {vehicle.brand} {vehicle.model}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="call_type"
        placeholder="Call Type"
        value={form.call_type}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-3"
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        rows="4"
        className="w-full border rounded-lg p-3 mb-4"
      />

      <button
        onClick={saveCall}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
      >
        Save Call
      </button>

    </div>
  );
}

export default AddCallForm;