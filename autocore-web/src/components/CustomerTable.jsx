import { Eye, Pencil, Trash2 } from "lucide-react";

function CustomerTable({ customers = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-900 text-white">

          <tr>

            <th className="p-4 text-left">ID</th>

            <th className="p-4 text-left">Name</th>

            <th className="p-4 text-left">Mobile</th>

            <th className="p-4 text-left">Email</th>

            <th className="p-4 text-center">Vehicles</th>

            <th className="p-4 text-center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {customers.map((customer) => (

            <tr
              key={customer.id}
              className="border-b hover:bg-slate-50 transition"
            >

              <td className="p-4">{customer.id}</td>

              <td className="p-4 font-semibold">
                {customer.name}
              </td>

              <td className="p-4">
                {customer.mobile}
              </td>

              <td className="p-4">
                {customer.email}
              </td>

              <td className="p-4 text-center">
                {customer.vehicle_count ?? 0}
              </td>

              <td className="p-4">

                <div className="flex justify-center gap-2">

                  <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                    <Eye size={18}/>
                  </button>

                  <button className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600">
                    <Pencil size={18}/>
                  </button>

                  <button className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700">
                    <Trash2 size={18}/>
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default CustomerTable;