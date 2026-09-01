import { useState, useEffect } from "react";
import api from "../services/api";

function AddVehicleForm({ customerId, vehicle, onSuccess }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    model_year: "",
    plate_number: "",
    chassis_number: "",
  });

  useEffect(() => {
    if (vehicle) {
      setForm({
        brand: vehicle.brand || "",
        model: vehicle.model || "",
        model_year: vehicle.model_year || "",
        plate_number: vehicle.plate_number || "",
        chassis_number: vehicle.chassis_number || "",
      });
    } else {
      setForm({
        brand: "",
        model: "",
        model_year: "",
        plate_number: "",
        chassis_number: "",
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveVehicle = async () => {
    const payload = {
      customer_id: customerId,
      brand: form.brand,
      model: form.model,
      model_year: Number(form.model_year),

      plate_number: form.plate_number,
      chassis_number: form.chassis_number,

      engine_number: "",
      color: "",
      transmission: "",
      fuel_type: "",
      current_km: 0,
    };

    try {
      if (vehicle) {
        await api.put(`/vehicles/${vehicle.id}`, payload);

        alert("Vehicle Updated Successfully ✅");
      } else {
        await api.post("/vehicles/", payload);

        alert("Vehicle Added Successfully ✅");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);

      alert(
        vehicle
          ? "Failed to update vehicle ❌"
          : "Failed to add vehicle ❌"
      );
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-gray-50 mt-6">

      <h3 className="text-2xl font-bold mb-6">
        {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="model_year"
          placeholder="Year"
          type="number"
          value={form.model_year}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="plate_number"
          placeholder="Plate Number"
          value={form.plate_number}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="chassis_number"
          placeholder="Chassis Number"
          value={form.chassis_number}
          onChange={handleChange}
          className="border rounded-lg p-3 col-span-2"
        />

      </div>

      <button
        onClick={saveVehicle}
        className="mt-6 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
      >
        {vehicle ? "Update Vehicle" : "Save Vehicle"}
      </button>

    </div>
  );
}

export default AddVehicleForm;