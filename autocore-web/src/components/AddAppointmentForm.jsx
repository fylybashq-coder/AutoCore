import { useState } from "react";
import api from "../services/api";

function AddAppointmentForm({
  customerId,
  vehicles,
  appointment,
  onSuccess,
}) {
  const [form, setForm] = useState({
    vehicle_id: appointment?.vehicle_id || "",
    appointment_date: appointment?.appointment_date || "",
    appointment_time: appointment?.appointment_time || "",
    service_type: appointment?.service_type || "",
    advisor: appointment?.advisor || "",
    notes: appointment?.notes || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAppointment = async () => {
    if (
      !form.vehicle_id ||
      !form.appointment_date ||
      !form.appointment_time ||
      !form.service_type
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (appointment) {
        await api.put(`/appointments/${appointment.id}`, {
          vehicle_id: Number(form.vehicle_id),
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
          service_type: form.service_type,
          advisor: form.advisor,
          notes: form.notes,
        });

        alert("Appointment updated successfully ✅");
      } else {
        await api.post("/appointments/", {
          customer_id: customerId,
          vehicle_id: Number(form.vehicle_id),
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
          service_type: form.service_type,
          advisor: form.advisor,
          notes: form.notes,
        });

        alert("Appointment created successfully ✅");
      }

      setForm({
        vehicle_id: "",
        appointment_date: "",
        appointment_time: "",
        service_type: "",
        advisor: "",
        notes: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);

      if (appointment) {
        alert("Failed to update appointment ❌");
      } else {
        alert("Failed to create appointment ❌");
      }
    }
  };

  return (
    <div className="border rounded-xl p-5 mt-6 bg-gray-50">

      <h3 className="text-xl font-bold mb-4">
        {appointment ? "Edit Appointment" : "New Appointment"}
      </h3>

      <select
        name="vehicle_id"
        value={form.vehicle_id}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-3"
      >
        <option value="">Select Vehicle</option>

        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.brand} {vehicle.model}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="appointment_date"
        value={form.appointment_date}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-3"
      />

      <input
        type="time"
        name="appointment_time"
        value={form.appointment_time}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-3"
      />

      <input
        type="text"
        name="service_type"
        placeholder="Service Type"
        value={form.service_type}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-3"
      />

      <input
        type="text"
        name="advisor"
        placeholder="Advisor"
        value={form.advisor}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-3"
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-4"
        rows="3"
      />

      <button
        onClick={saveAppointment}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
      >
        {appointment ? "Update Appointment" : "Save Appointment"}
      </button>

    </div>
  );
}

export default AddAppointmentForm;