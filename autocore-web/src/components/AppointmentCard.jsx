import api from "../services/api";

function AppointmentCard({ appointment, onDelete, onEdit }) {

  const deleteAppointment = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/appointments/${appointment.id}`);

      alert("Appointment deleted successfully ✅");

      if (onDelete) {
        onDelete();
      }

    } catch (err) {
      console.error(err);
      alert("Failed to delete appointment ❌");
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition">

      <div className="flex justify-between">

        <div>
          <p><strong>Date:</strong> {appointment.appointment_date}</p>
          <p><strong>Time:</strong> {appointment.appointment_time}</p>
          <p><strong>Service:</strong> {appointment.service_type}</p>
          <p><strong>Status:</strong> {appointment.status}</p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => onEdit(appointment)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
          >
            ✏ Edit
          </button>

          <button
            onClick={deleteAppointment}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
          >
            🗑 Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default AppointmentCard;