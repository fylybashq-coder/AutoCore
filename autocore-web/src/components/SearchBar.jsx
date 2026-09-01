import Modal from "./Modal";
import { useState } from "react";
import api from "../services/api";
import VehicleCard from "./VehicleCard";
import AddVehicleForm from "./AddVehicleForm";
import AddAppointmentForm from "./AddAppointmentForm";
import AddCallForm from "./AddCallForm";
import AppointmentCard from "./AppointmentCard";

function SearchBar() {
  const [mobile, setMobile] = useState("");
  const [data, setData] = useState(null);

  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCallForm, setShowCallForm] = useState(false);

  const searchCustomer = async (mobileNumber = mobile) => {
    if (!mobileNumber) {
      alert("Please enter mobile number");
      return;
    }

    try {
      const response = await api.get(`/customers/360/${mobileNumber}`);
      setData(response.data);
    } catch (error) {
      console.error(error);
      alert("Customer Not Found ❌");
      setData(null);
    }
  };

  return (
    <>
      {/* Search */}

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter Customer Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3"
        />

        <button
          onClick={() => searchCustomer()}
          className="bg-blue-700 text-white px-8 rounded-lg hover:bg-blue-800"
        >
          Search
        </button>
      </div>

      {data && (
        <div className="mt-10">
          <hr className="mb-8" />

          {/* Customer */}

          <div className="border rounded-xl shadow p-6 mb-8">
            <h2 className="text-3xl font-bold mb-6">
              👤 Customer Information
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <p>
                <strong>Name:</strong> {data.customer.name}
              </p>

              <p>
                <strong>Mobile:</strong> {data.customer.mobile}
              </p>

              <p>
                <strong>ID:</strong> {data.customer.id}
              </p>

              <p>
                <strong>Email:</strong> {data.customer.email}
              </p>
            </div>
          </div>

          {/* Vehicles + Appointments */}

          <div className="grid grid-cols-2 gap-6">

            {/* Vehicles */}

            <div className="border rounded-xl shadow p-6 min-h-[250px]">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-3xl font-bold">
                  🚗 Vehicles ({data.vehicles.length})
                </h2>

                <button
                 onClick={() => {
  setSelectedVehicle(null);
  setShowVehicleForm(!showVehicleForm);
}}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                  {showVehicleForm ? "Close" : "+ Add Vehicle"}
                </button>

              </div>

              {data.vehicles.length === 0 ? (
                <p className="text-gray-400 italic mt-4">
                  No Vehicles Found
                </p>
              ) : (
                data.vehicles.map((vehicle) => (
                  <VehicleCard
  key={vehicle.id}
  vehicle={vehicle}
  onEdit={(vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleForm(true);
  }}
  onDelete={() => searchCustomer(data.customer.mobile)}
/>
                ))
              )}

              {showVehicleForm && (
  <Modal
    title={selectedVehicle ? "Edit Vehicle" : "Add Vehicle"}
    onClose={() => {
      setShowVehicleForm(false);
      setSelectedVehicle(null);
    }}
  >
    <AddVehicleForm
      customerId={data.customer.id}
      vehicle={selectedVehicle}
      onSuccess={() => {
        setSelectedVehicle(null);
        setShowVehicleForm(false);
        searchCustomer(data.customer.mobile);
      }}
    />
  </Modal>
)}

            </div>

            {/* Appointments */}

            <div className="border rounded-xl shadow p-6 min-h-[250px]">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-3xl font-bold">
                  📅 Appointments ({data.appointments.length})
                </h2>

                <button
                  onClick={() => {
    setSelectedAppointment(null);
    setShowAppointmentForm(true);
}}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                >
                  {showAppointmentForm ? "Close" : "+ Book Appointment"}
                </button>

              </div>

              {data.appointments.length === 0 ? (
                <p className="text-gray-400 italic mt-4">
                  No Appointments Found
                </p>
              ) : (
                data.appointments.map((appointment) => (
  <AppointmentCard
    key={appointment.id}
    appointment={appointment}
    onDelete={() => searchCustomer(data.customer.mobile)}
    onEdit={(appointment) => {
      setSelectedAppointment(appointment);
      setShowAppointmentForm(true);
    }}
  />
))
              )}

             {showAppointmentForm && (
    <Modal
        title={selectedAppointment ? "Edit Appointment" : "New Appointment"}
        onClose={() => {
            setShowAppointmentForm(false);
            setSelectedAppointment(null);
        }}
    >
        <AddAppointmentForm
            customerId={data.customer.id}
            vehicles={data.vehicles}
            appointment={selectedAppointment}
            onSuccess={() => {
                setSelectedAppointment(null);
                setShowAppointmentForm(false);
                searchCustomer(data.customer.mobile);
            }}
        />
    </Modal>
)}

            </div>

          </div>

          {/* Calls */}

          <div className="border rounded-xl shadow p-6 mt-6 min-h-[250px]">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-3xl font-bold">
                📞 Calls ({data.calls.length})
              </h2>

              <button
  onClick={() => setShowCallForm(!showCallForm)}
  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
>
  {showCallForm ? "Close" : "+ New Call"}
</button>

            </div>

            {data.calls.length === 0 ? (
              <p className="text-gray-400 italic mt-4">
                No Calls Found
              </p>
            ) : (
              data.calls.map((call) => (
                
                <div
                  key={call.id}
                  className="border rounded-lg p-4 mb-4 hover:shadow-md transition"
                >
                  <p>
  <strong>Date:</strong>{" "}
  {call.created_at
    ? new Date(call.created_at).toLocaleString("en-GB")
    : "-"}
</p>

                  <p>
                    <strong>Type:</strong> {call.call_type}
                  </p>

                  <p>
                    <strong>Notes:</strong> {call.notes}
                  </p>
                </div>
              ))
            )}
            {showCallForm && (
  <AddCallForm
    customerId={data.customer.id}
    vehicles={data.vehicles}
    onSuccess={() => {
      setShowCallForm(false);
      searchCustomer(data.customer.mobile);
    }}
  />
)}

          </div>

        </div>
      )}
    </>
  );
}

export default SearchBar;