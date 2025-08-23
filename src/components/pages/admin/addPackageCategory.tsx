/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../reduxKit/store";
import toast from "react-hot-toast";
import { AdminNavbar } from "../../Navbar/adminNavbar";
import { addCategoryAction } from "../../../reduxKit/actions/admin/addCategoryAction";

interface Prices {
  adult: number;
  child: number;
}

interface Categories {
  Normal: Prices;
  Premium: Prices;
  Luxury: Prices;
}

interface FormData {
  packageName: string;
  description: string;
  categories: Categories;
  adultCount: number; // always 1
  childCount: number; // always 1
  imageUrl: string;
}

const AdminCategoryPriceForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<FormData>({
    packageName: "",
    description: "",
    categories: {
      Normal: { adult:0, child:0 },
      Premium: { adult:0, child:0 },
      Luxury: { adult:0, child:0 },
    },
    adultCount: 1,
    childCount: 1,
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleCategoryPriceChange = (
    category: keyof Categories,
    field: "adult" | "child",
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [field]: value,
        },
      },
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(addCategoryAction(formData)).unwrap();
      if (response.success) {
        toast.success(response.message);
        // Reset form
       
      }
      setLoading(false);
    } catch (error: any) {
      console.log("Error while adding the package ", error);
      setLoading(false);
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
          Add Package with Prices
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

        {/* Image URL */}
        <label className="block">
          <span className="text-black font-medium mb-1">Image URL</span>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Paste image URL here"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </label>

        {/* Prices for Each Category */}
        <div className="space-y-6">
          {(["Normal", "Premium", "Luxury"] as (keyof Categories)[]).map(
            (category) => (
              <div key={category} className="border p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-4 text-green-700">
                  {category} Category
                </h3>

                <div className="flex gap-6">
                  <label className="flex-1 flex flex-col">
                    <span className="text-black font-medium mb-1">
                      Adult Price
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={formData.categories[category].adult}
                      onChange={(e) =>
                        handleCategoryPriceChange(
                          category,
                          "adult",
                          Number(e.target.value)
                        )
                      }
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </label>

                  <label className="flex-1 flex flex-col">
                    <span className="text-black font-medium mb-1">
                      Child Price
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={formData.categories[category].child}
                      onChange={(e) =>
                        handleCategoryPriceChange(
                          category,
                          "child",
                          Number(e.target.value)
                        )
                      }
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </label>
                </div>
              </div>
            )
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:from-green-500 hover:via-green-600 hover:to-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default AdminCategoryPriceForm;
