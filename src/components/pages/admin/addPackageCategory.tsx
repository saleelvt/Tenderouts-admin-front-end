/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../reduxKit/store";
import toast from "react-hot-toast";
import { AdminNavbar } from "../../Navbar/adminNavbar";
import { addCategoryAction } from "../../../reduxKit/actions/admin/addCategoryAction";

type CategoryType = "Normal" | "Premium" | "Luxury";

interface FormData {
  packageName: string;        // Added packageName
  description: string;        // Added description
  categoryType: CategoryType;
  adultCount: number;
  childCount: number;
  adultPrice: number;
  childPrice: number;
  imageUrl: string;
}

const AdminCategoryPriceForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    packageName: "",
    description: "",
    categoryType: "Normal",
    adultCount: 1,
    childCount: 1,
    adultPrice: 0,
    childPrice: 0,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "adultPrice" ||
        name === "childPrice" ||
        name === "adultCount" ||
        name === "childCount"
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: e.target.value,
    }));
  };

  // Fixed increment & decrement handlers to prevent unwanted blur or outside clicks issues
  const increment = (field: "adultCount" | "childCount") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] + 1,
    }));
  };

  const decrement = (field: "adultCount" | "childCount") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] > 0 ? prev[field] - 1 : 0,
    }));
  };

  const handleMouseDownButton = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(addCategoryAction(formData)).unwrap();
      if (response.success) {
        toast.success(response.message);
        setFormData({
          packageName: "",
          description: "",
          categoryType: "Normal",
          adultCount: 1,
          childCount: 1,
          adultPrice: 0,
          childPrice: 0,
          imageUrl: "",
        });
      }
      setLoading(false);
    } catch (error: any) {
      console.log("Error while adding the package ", error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-6 mt-2 bg-white rounded-lg shadow-md space-y-8"
      >
        <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center">
          Add Category & Price
        </h2>

        {/* Package Name */}
        <label className="block">
          <span className="text-black font-medium mb-1">Package Name</span>
          <input
            type="text"
            name="packageName"
            value={formData.packageName}
            onChange={handleChange}
            placeholder="Enter package name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </label>

        {/* Description */}
        <label className="block">
          <span className="text-black font-medium mb-1">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter package description"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            required
          />
        </label>

        {/* Category & Image URL on one row */}
        <div className="flex gap-6">
          <label className="flex-1 flex flex-col">
            <span className="text-black font-medium mb-1">Category Type</span>
            <select
              name="categoryType"
              value={formData.categoryType}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="Normal">Normal</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
            </select>
          </label>

          <label className="flex-1 flex flex-col">
            <span className="text-black font-medium mb-1">Image URL</span>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleImageChange}
              placeholder="Paste image URL here"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>
        </div>

        {/* Adult Price & Child Price */}
        <div className="flex gap-6">
          <label className="flex-1 flex flex-col">
            <span className="text-black font-medium mb-1">Adult Price ($)</span>
            <input
              type="number"
              name="adultPrice"
              min={0}
              value={formData.adultPrice}
              onChange={handleChange}
              placeholder="Enter Adult Price"
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>

          <label className="flex-1 flex flex-col">
            <span className="text-black font-medium mb-1">Child Price ($)</span>
            <input
              type="number"
              name="childPrice"
              min={0}
              value={formData.childPrice}
              onChange={handleChange}
              placeholder="Enter Child Price"
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>
        </div>

        {/* Adult Count & Child Count */}
        <div className="flex gap-6">
          <label className="flex-1 flex flex-col">
            <span className="text-black font-medium mb-1">Adult Count</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onMouseDown={handleMouseDownButton}
                onClick={() => decrement("adultCount")}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition select-none"
                aria-label="Decrease adult count"
              >
                -
              </button>
              <input
                type="number"
                name="adultCount"
                min={0}
                value={formData.adultCount}
                onChange={handleChange}
                className="w-16 text-center border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onMouseDown={handleMouseDownButton}
                onClick={() => increment("adultCount")}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition select-none"
                aria-label="Increase adult count"
              >
                +
              </button>
            </div>
          </label>

          <label className="flex-1 flex flex-col">
            <span className="text-black font-medium mb-1">Child Count</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onMouseDown={handleMouseDownButton}
                onClick={() => decrement("childCount")}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition select-none"
                aria-label="Decrease child count"
              >
                -
              </button>
              <input
                type="number"
                name="childCount"
                min={0}
                value={formData.childCount}
                onChange={handleChange}
                className="w-16 text-center border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onMouseDown={handleMouseDownButton}
                onClick={() => increment("childCount")}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition select-none"
                aria-label="Increase child count"
              >
                +
              </button>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:from-green-500 hover:via-green-600 hover:to-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
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
          )}
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default AdminCategoryPriceForm;
