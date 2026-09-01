import Modal from "../components/Modal";
import AddCustomerForm from "../components/AddCustomerForm";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Pencil, 
  Trash2, 
  Search, 
  Users, 
  Car, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  X,
  AlertTriangle
} from "lucide-react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Custom Confirmation Delete Modal State
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch Customers
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers");
      setCustomers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Clear search term using the 'X' button
  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // Execute Delete after user confirms in Custom Modal
  const confirmDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      await api.delete(`/customers/${customerToDelete.id}`);
      setCustomerToDelete(null);
      loadCustomers();
    } catch (err) {
      console.error(err);
      alert("Delete Failed");
    }
  };

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const name = customer?.name?.toLowerCase() || "";
      const mobile = customer?.mobile || "";
      const searchTerm = search.toLowerCase();
      return name.includes(searchTerm) || mobile.includes(searchTerm);
    });
  }, [customers, search]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  // Calculate Total Vehicles
  const totalVehicles = useMemo(() => {
    return customers.reduce(
      (sum, customer) => sum + (Number(customer?.vehicle_count) || 0),
      0
    );
  }, [customers]);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header at top with Z-Index */}
        <Header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200 px-8 py-4" />

        <div className="p-8 flex-1">
          {/* Header Title & Add Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Customers
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                Manage all customer profiles and vehicles
              </p>
            </div>

            {/* Add Customer Button with shadow & hover elevation */}
            <button
              onClick={() => {
                setSelectedCustomer(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Plus size={20} />
              <span>Add Customer</span>
            </button>
          </div>

          {/* Equal Height Cards (h-28) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Total Customers */}
            <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg p-6 flex justify-between items-center hover:-translate-y-1 hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden">
              <div className="z-10">
                <p className="text-blue-100 font-medium text-xs uppercase tracking-wider">
                  Total Customers
                </p>
                <h2 className="text-4xl font-extrabold text-white mt-1">
                  {customers.length}
                </h2>
              </div>
              <Users size={60} className="text-white/20 absolute right-4 bottom-1 pointer-events-none" />
            </div>

            {/* Card 2: Search Results */}
            <div className="h-28 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl shadow-lg p-6 flex justify-between items-center hover:-translate-y-1 hover:shadow-emerald-500/25 transition-all duration-300 relative overflow-hidden">
              <div className="z-10">
                <p className="text-emerald-100 font-medium text-xs uppercase tracking-wider">
                  Search Results
                </p>
                <h2 className="text-4xl font-extrabold text-white mt-1">
                  {filteredCustomers.length}
                </h2>
              </div>
              <UserCheck size={60} className="text-white/20 absolute right-4 bottom-1 pointer-events-none" />
            </div>

            {/* Card 3: Total Vehicles */}
            <div className="h-28 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg p-6 flex justify-between items-center hover:-translate-y-1 hover:shadow-orange-500/25 transition-all duration-300 relative overflow-hidden">
              <div className="z-10">
                <p className="text-orange-100 font-medium text-xs uppercase tracking-wider">
                  Total Vehicles
                </p>
                <h2 className="text-4xl font-extrabold text-white mt-1">
                  {totalVehicles}
                </h2>
              </div>
              <Car size={60} className="text-white/20 absolute right-4 bottom-1 pointer-events-none" />
            </div>
          </div>

          {/* Search Bar & Results Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="relative w-full sm:w-[520px]">
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by Name or Mobile..."
                value={search}
                onChange={handleSearchChange}
                className="w-full border border-slate-300 bg-white rounded-xl py-3 pl-12 pr-10 text-slate-800 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition duration-200 shadow-sm"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
              Showing{" "}
              <span className="text-blue-600 font-bold">
                {paginatedCustomers.length}
              </span>{" "}
              of <span className="text-slate-800 font-bold">{filteredCustomers.length}</span> customers
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-slate-200 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="p-5">ID</th>
                    <th className="p-5">Name</th>
                    <th className="p-5">Mobile</th>
                    <th className="p-5">Email</th>
                    <th className="p-5 text-center">Vehicles</th>
                    <th className="p-5 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="animate-fade-in divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-500 font-medium">
                        Loading customers...
                      </td>
                    </tr>
                  ) : paginatedCustomers.length > 0 ? (
                    paginatedCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="odd:bg-white even:bg-slate-50/50 hover:bg-slate-50 hover:-translate-y-[1px] hover:shadow-sm transition-all duration-200"
                      >
                        <td className="p-5">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold font-mono">
                            #{customer.id}
                          </span>
                        </td>

                        <td className="p-5">
                          <Link
                            to={`/customers/${customer.id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition"
                          >
                            {customer.name}
                          </Link>
                        </td>

                        <td className="p-5 text-slate-600 font-medium">
                          {customer.mobile || "-"}
                        </td>

                        <td className="p-5 text-slate-600">
                          {customer.email || "-"}
                        </td>

                        <td className="p-5 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg shadow-md shadow-blue-500/20">
                            {customer.vehicle_count || 0}
                          </span>
                        </td>

                        <td className="p-5 text-center">
                          <div className="flex justify-center gap-2.5">
                            <button
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setShowModal(true);
                              }}
                              className="bg-amber-400 hover:bg-amber-500 hover:scale-105 text-white p-2.5 rounded-xl shadow-md transition-all duration-200"
                              title="Edit Customer"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => setCustomerToDelete(customer)}
                              className="bg-rose-600 hover:bg-rose-700 hover:scale-105 text-white p-2.5 rounded-xl shadow-md transition-all duration-200"
                              title="Delete Customer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12">
                        <div className="max-w-sm mx-auto">
                          <h3 className="text-lg font-bold text-slate-700">
                            No Customers Found
                          </h3>
                          <p className="text-slate-400 text-sm mt-1">
                            Try another search keyword.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!loading && filteredCustomers.length > itemsPerPage && (
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
                <span className="text-sm text-slate-500 font-medium">
                  Page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
                  <span className="font-bold text-slate-800">{totalPages}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 text-sm font-bold rounded-lg transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add / Edit Form Modal */}
          {showModal && (
            <Modal
              title={selectedCustomer ? "Edit Customer" : "Add Customer"}
              onClose={() => {
                setShowModal(false);
                setSelectedCustomer(null);
              }}
            >
              <AddCustomerForm
                customer={selectedCustomer}
                onSuccess={() => {
                  setShowModal(false);
                  setSelectedCustomer(null);
                  loadCustomers();
                }}
              />
            </Modal>
          )}

          {/* Delete Modal */}
          {customerToDelete && (
            <Modal
              title="Delete Customer"
              onClose={() => setCustomerToDelete(null)}
            >
              <div className="p-2 text-center">
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={30} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Are you sure?
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  You are about to delete <span className="font-bold text-slate-800">{customerToDelete.name}</span>. This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setCustomerToDelete(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteCustomer}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md shadow-rose-600/30 transition"
                  >
                    Delete Customer
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default Customers;