import api from "../services/api";

function VehicleCard({ vehicle, onEdit, onDelete }) {
  const deleteVehicle = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/vehicles/${vehicle.id}`);

      alert("Vehicle deleted successfully ✅");

      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error(err);

      alert("Failed to delete vehicle ❌");
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition mb-4">

      <div className="flex justify-between items-start">

        <div>
          <h3 className="text-lg font-bold text-blue-700">
            {vehicle.brand}
          </h3>

          <p>
            <strong>Model:</strong> {vehicle.model}
          </p>

          <p>
            <strong>Year:</strong> {vehicle.model_year}
          </p>

          <p>
            <strong>Plate:</strong>{" "}
            {vehicle.plate_number || "-"}
          </p>

          <p>
            <strong>Chassis:</strong>{" "}
            {vehicle.chassis_number || "-"}
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => onEdit(vehicle)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
          >
            ✏️ Edit
          </button>

          <button
            onClick={deleteVehicle}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
          >
            🗑 Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default VehicleCard;