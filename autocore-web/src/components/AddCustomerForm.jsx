import { useState, useEffect } from "react";
import api from "../services/api";

function AddCustomerForm({ customer, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email,
      });
    }
  }, [customer]);

  async function saveCustomer(e) {
    e.preventDefault();

    try {
      if (customer) {
        await api.put(`/customers/${customer.id}`, form);
        alert("Customer Updated ✅");
      } else {
        await api.post("/customers", form);
        alert("Customer Added ✅");
      }

      onSuccess();

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  }

  return (
    <form
      onSubmit={saveCustomer}
      className="space-y-5"
    >
      <div>
        <label className="font-semibold">
          Name
        </label>

        <input
          className="w-full border rounded-lg p-3 mt-2"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="font-semibold">
          Mobile
        </label>

        <input
          className="w-full border rounded-lg p-3 mt-2"
          value={form.mobile}
          onChange={(e) =>
            setForm({
              ...form,
              mobile: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="font-semibold">
          Email
        </label>

        <input
          className="w-full border rounded-lg p-3 mt-2"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />
      </div>

      <button className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800">
        {customer ? "Update Customer" : "Save Customer"}
      </button>
    </form>
  );
}

export default AddCustomerForm;