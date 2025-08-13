/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { addCategoryAction } from "../../../reduxKit/actions/admin/addCategoryAction";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../reduxKit/store";
import toast from "react-hot-toast";

type CategoryType = "Normal" | "Premium" | "Luxury";

interface FormData {
  categoryType: CategoryType;
  adultCount: number;
  childCount: number;
  adultPrice: number;
  childPrice: number;
}

const AdminCategoryPriceForm: React.FC = () => {
    const dispatch=useDispatch<AppDispatch>()
  const [formData, setFormData] = useState<FormData>({
    categoryType: "Normal",
    adultCount: 1,
    childCount: 1,
    adultPrice: 0,
    childPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, categoryType: e.target.value as CategoryType }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? 0 : Number(value);
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const increment = (field: "adultCount" | "childCount" ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] + 1,
    }));
  };

  const decrement = (field: "adultCount" | "childCount" ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] > 0 ? prev[field] - 1 : 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate async submission
    try {
        console.log("Submitted Data:", formData);
         const response = await dispatch(addCategoryAction(formData)).unwrap()
         if(response.success){
          toast.success(response.message)
         }
     console.log("my respose of the data ",response);
    setLoading(false);
    } catch (error:any) {
        console.log("error while adding the package ",error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 mt-20 bg-white rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center">
        Add Category & Price
      </h2>

      {/* Category Dropdown */}
      <label className="block">
        <span className="text-black font-medium mb-1 block">Category Type</span>
        <select
          value={formData.categoryType}
          onChange={handleCategoryChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="Normal">Normal</option>
          <option value="Premium">Premium</option>
          <option value="Luxury">Luxury</option>
        </select>
      </label>

      {/* Adult Price */}
      <label className="block">
        <span className="text-black font-medium mb-1 block">Adult Price ($)</span>
        <input
          type="number"
          name="adultPrice"
          min={0}
          value={formData.adultPrice}
          onChange={handlePriceChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter Adult Price"
          required
        />
      </label>

      {/* Child Price */}
      <label className="block">
        <span className="text-black font-medium mb-1 block">Child Price ($)</span>
        <input
          type="number"
          name="childPrice"
          min={0}
          value={formData.childPrice}
          onChange={handlePriceChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter Child Price"
          required
        />
      </label>

      {/* Adult Count */}
      <label className="block">
        <span className="text-black font-medium mb-1 block">Adult Count</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => decrement("adultCount")}
            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
            aria-label="Decrease adult count"
          >
            -
          </button>
          <span className="text-black text-xl font-semibold">{formData.adultCount}</span>
          <button
            type="button"
            onClick={() => increment("adultCount")}
            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
            aria-label="Increase adult count"
          >
            +
          </button>
        </div>
      </label>

      {/* Child Count */}
      <label className="block">
        <span className="text-black font-medium mb-1 block">Child Count</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => decrement("childCount")}
            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
            aria-label="Decrease child count"
          >
            -
          </button>
          <span className="text-black text-xl font-semibold">{formData.childCount}</span>
          <button
            type="button"
            onClick={() => increment("childCount")}
            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
            aria-label="Increase child count"
          >
            +
          </button>
        </div>
      </label>

      {/* Max Adults */}
   
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
  );
};

export default AdminCategoryPriceForm;
