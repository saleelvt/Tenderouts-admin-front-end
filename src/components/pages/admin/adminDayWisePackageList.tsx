/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../reduxKit/store";
import { admingGetDetailedPackages, deleteDayWisePackageAction } from "../../../reduxKit/actions/admin/addDayWisePackageAction";
import { FaTrash } from "react-icons/fa";
import { AdminNavbar } from "../../Navbar/adminNavbar";
import toast from "react-hot-toast";

// TYPES
type HotelCategory = "Normal" | "Premium" | "Luxury";

interface Activity {
  title: string;
  description: string;
  time: string;
  imageUrl: string;
}

interface Hotel {
  name: string;
  location: string;
  category: HotelCategory;
}

interface PackageData {
  _id: string;
  packageId: string;
  dayNumber: number;
  destination: string;
  activities: Activity[];
  hotels: Hotel[];
  priceIncludes: string[];
  priceExcludes: string[];
}

// Main Component
const AdminDayWisePackageList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await dispatch(admingGetDetailedPackages()).unwrap();
        if (response.success && Array.isArray(response.data)) {
          setPackages(response.data);
        }
      } catch (error: any) {
        toast.error("Failed to fetch detailed packages.");
        console.error("Failed to fetch detailed packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [dispatch]);

  // Get unique destination names for dropdown
  const destinationOptions = Array.from(
    new Set(packages.map((pkg) => pkg.destination))
  );

  // Filter packages by selected destination
  const filteredPackages = selectedDestination
    ? packages.filter((pkg) => pkg.destination === selectedDestination)
    : packages;

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    setDeletingId(id);
    try {
      const response = await dispatch(deleteDayWisePackageAction(id)).unwrap();
      if (response.success) {
        toast.success(response.message);
        setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      } else {
        toast.error(response.message || "Failed to delete package.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete package.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-green-800 mb-4 text-center">
          Detailed Package List
        </h2>

        {/* Destination filter dropdown */}
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="destination" className="font-medium text-gray-700">
            Filter by Destination:
          </label>
          <select
            id="destination"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            {destinationOptions.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        ) : filteredPackages.length === 0 ? (
          <p className="text-center text-gray-500">No packages found for selected destination.</p>
        ) : (
          <div className="space-y-5">
            {filteredPackages
              .sort((a, b) => a.dayNumber - b.dayNumber)
              .map((pkg) => (
                <div key={pkg._id} className="border rounded-lg shadow hover:shadow-lg transition p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="bg-green-200 text-green-900 py-1 px-3 rounded-full text-sm mr-2">
                        Day {pkg.dayNumber}
                      </span>
                      <span className="font-bold text-xl capitalize">{pkg.destination}</span>
                    </div>
                    <button
                      className={`p-2 rounded bg-red-500 text-white hover:bg-red-700 transition flex items-center gap-1 ${
                        deletingId === pkg._id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleDelete(pkg._id)}
                      disabled={deletingId === pkg._id}
                    >
                      <FaTrash />
                      {deletingId === pkg._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>

                  {/* Hotels */}
                  <div className="mt-3">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">Hotels:</h3>
                    <table className="w-full mb-4 border text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="py-1 px-2 border">Name</th>
                          <th className="py-1 px-2 border">Location</th>
                          <th className="py-1 px-2 border">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pkg.hotels.map((hotel, idx) => (
                          <tr key={idx} className="text-center">
                            <td className="py-1 px-2 border">{hotel.name}</td>
                            <td className="py-1 px-2 border">{hotel.location}</td>
                            <td className="py-1 px-2 border">{hotel.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Activities */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">Activities:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {pkg.activities.map((act, idx) => (
                        <div key={idx} className="bg-white border rounded p-3 shadow-sm flex flex-col">
                          <div>
                            <img
                              src={act.imageUrl}
                              alt={act.title}
                              className="h-32 w-full object-cover rounded mb-2 border"
                              onError={(e: any) => (e.target.style.display = "none")}
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-green-700 mb-1">{act.title}</div>
                            <div className="text-sm text-gray-600 mb-1">{act.description}</div>
                            <div className="text-xs text-gray-400">Time: {act.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Includes/Excludes */}
                  <div className="mt-3 flex flex-wrap gap-8">
                    <div>
                      <h4 className="font-medium text-gray-700">Price Includes:</h4>
                      <ul className="list-disc list-inside text-green-800">
                        {pkg.priceIncludes.map((inc, i) => (
                          <li key={i}>{inc}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Price Excludes:</h4>
                      <ul className="list-disc list-inside text-red-700">
                        {pkg.priceExcludes.map((exc, i) => (
                          <li key={i}>{exc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDayWisePackageList;
