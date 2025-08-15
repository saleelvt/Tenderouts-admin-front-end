/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../reduxKit/store";
import { admingGetPackages, deleteCategoryAction } from "../../../reduxKit/actions/admin/addCategoryAction";
import { FaTrash } from "react-icons/fa";
import { AdminNavbar } from "../../Navbar/adminNavbar";
import toast from "react-hot-toast";

type CategoryType = "Normal" | "Premium" | "Luxury";

interface PackageData {
  _id: string;
  packageName: string;
  description?: string;
  categoryType: CategoryType;
  AdultsCount: number;
  ChildrenCount: number;
  adultPrice: number;
  childPrice: number;
  imageUrl?: string;
}

const AdminCategoryPackageList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch packages on mount
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await dispatch(admingGetPackages()).unwrap();
        if (response.success && Array.isArray(response.data)) {
          setPackages(response.data);
        }
      } catch (error: any) {
        toast.error("Failed to fetch packages.");
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [dispatch]);

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    setDeletingId(id);
    try {
      const response = await dispatch(deleteCategoryAction(id)).unwrap();
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

      <div className="max-w-6xl mx-auto p-1 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-green-800 mb-3 text-center">
          Category Price Packages
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        ) : packages.length === 0 ? (
          <p className="text-center text-gray-500">No packages found.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-100">
                <th className="border border-gray-300 px-4 py-2">Package Name</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Adult Count</th>
                <th className="border border-gray-300 px-4 py-2">Child Count</th>
                <th className="border border-gray-300 px-4 py-2">Adult Price ($)</th>
                <th className="border border-gray-300 px-4 py-2">Child Price ($)</th>
                <th className="border border-gray-300 px-4 py-2">Image</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg._id} className="text-center hover:bg-green-50">
                  <td className="border border-gray-300 px-4 py-2 whitespace-normal break-words">{pkg.packageName}</td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-normal break-words text-xs">{pkg.description || "—"}</td>
                  <td className="border border-gray-300 px-4 py-2">{pkg.categoryType}</td>
                  <td className="border border-gray-300 px-4 py-2">{pkg.AdultsCount}</td>
                  <td className="border border-gray-300 px-4 py-2">{pkg.ChildrenCount}</td>
                  <td className="border border-gray-300 px-4 py-2">{pkg.adultPrice}</td>
                  <td className="border border-gray-300 px-4 py-2">{pkg.childPrice}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {pkg.imageUrl ? (
                      <img
                        src={pkg.imageUrl}
                        alt={`Category ${pkg.categoryType} Image`}
                        className="mx-auto h-16 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      disabled={deletingId === pkg._id}
                      onClick={() => handleDelete(pkg._id)}
                      className="text-red-600 hover:text-red-800 focus:outline-none p-2 rounded disabled:opacity-50"
                      title="Delete Package"
                      aria-label={`Delete package ${pkg.packageName}`}
                    >
                      {deletingId === pkg._id ? (
                        <svg
                          className="inline-block animate-spin h-5 w-5 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : (
                        <FaTrash className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminCategoryPackageList;
