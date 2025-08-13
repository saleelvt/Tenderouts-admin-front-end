/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../reduxKit/store";
import toast from "react-hot-toast";
import { AdminAddDayWisePackageAction } from "../../../reduxKit/actions/admin/addDayWisePackageAction";

type HotelCategory = "Normal" | "Premium" | "Luxury";

interface Activity {
  title: string;
  description?: string;
  time?: string;
}

interface Hotel {
  name: string;
  category: HotelCategory;
}

interface FormData {
  packageId: string;
  dayNumber: number;
  destination: string;
  activities: Activity[];
  images: string[];
  hotels: Hotel[];
}

const AdminDayWiseDetailsForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<FormData>({
    packageId: "",
    dayNumber: 1,
    destination: "",
    activities: [{ title: "", description: "", time: "" }],
    images: [""],
    hotels: [{ name: "", category: "Normal" }],
  });

  const [loading, setLoading] = useState(false);

  /** ------------------------
   * Handle Field Change
   * ------------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /** ------------------------
   * Handle Activity Change
   * ------------------------ */
  const handleActivityChange = (index: number, field: keyof Activity, value: string) => {
    const updated = [...formData.activities];
    updated[index][field] = value;
    setFormData({ ...formData, activities: updated });
  };

  const addActivity = () => {
    setFormData({
      ...formData,
      activities: [...formData.activities, { title: "", description: "", time: "" }],
    });
  };

  const removeActivity = (index: number) => {
    const updated = [...formData.activities];
    updated.splice(index, 1);
    setFormData({ ...formData, activities: updated });
  };

  /** ------------------------
   * Handle Hotel Change
   * ------------------------ */
  const handleHotelChange = (index: number, field: keyof Hotel, value: string) => {
    const updated = [...formData.hotels];
    updated[index][field] = value as any;
    setFormData({ ...formData, hotels: updated });
  };

  const addHotel = () => {
    setFormData({
      ...formData,
      hotels: [...formData.hotels, { name: "", category: "Normal" }],
    });
  };

  const removeHotel = (index: number) => {
    const updated = [...formData.hotels];
    updated.splice(index, 1);
    setFormData({ ...formData, hotels: updated });
  };

  /** ------------------------
   * Handle Image Change
   * ------------------------ */
  const handleImageChange = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImage = (index: number) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData({ ...formData, images: updated });
  };

  /** ------------------------
   * Handle Submit
   * ------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting:", formData);
      const res = await dispatch(AdminAddDayWisePackageAction(formData)).unwrap();
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to add day-wise details");
    } finally {
      setLoading(false);
    }
  };

  /** ------------------------
   * Render Form
   * ------------------------ */
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center">
        Add Day-Wise Package Details
      </h2>

      {/* packageId */}
      <label className="block">
        <span className="font-medium mb-1 block">Package ID</span>
        <input
          name="packageId"
          value={formData.packageId}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </label>

      {/* Day Number */}
      <label className="block">
        <span className="font-medium mb-1 block">Day Number</span>
        <input
          type="number"
          name="dayNumber"
          min={1}
          value={formData.dayNumber}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </label>

      {/* Destination */}
      <label className="block">
        <span className="font-medium mb-1 block">Destination</span>
        <input
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </label>

      {/* Activities */}
      <div>
        <h3 className="font-semibold mb-2">Activities</h3>
        {formData.activities.map((act, idx) => (
          <div key={idx} className="border p-3 mb-3 rounded space-y-2">
            <input
              placeholder="Title"
              value={act.title}
              onChange={(e) => handleActivityChange(idx, "title", e.target.value)}
              className="w-full border px-2 py-1 rounded"
              required
            />
            <input
              placeholder="Description"
              value={act.description || ""}
              onChange={(e) => handleActivityChange(idx, "description", e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <input
              placeholder="Time"
              value={act.time || ""}
              onChange={(e) => handleActivityChange(idx, "time", e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <button
              type="button"
              onClick={() => removeActivity(idx)}
              className="text-red-500 text-sm"
            >
              Remove Activity
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addActivity}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Add Activity
        </button>
      </div>

      {/* Images */}
      <div>
        <h3 className="font-semibold mb-2">Images</h3>
        {formData.images.map((img, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              placeholder="Image URL"
              value={img}
              onChange={(e) => handleImageChange(idx, e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="text-red-500"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Add Image
        </button>
      </div>

      {/* Hotels */}
      <div>
        <h3 className="font-semibold mb-2">Hotels</h3>
        {formData.hotels.map((hotel, idx) => (
          <div key={idx} className="border p-3 mb-3 rounded space-y-2">
            <input
              placeholder="Hotel Name"
              value={hotel.name}
              onChange={(e) => handleHotelChange(idx, "name", e.target.value)}
              className="w-full border px-2 py-1 rounded"
              required
            />
            <select
              value={hotel.category}
              onChange={(e) => handleHotelChange(idx, "category", e.target.value)}
              className="w-full border px-2 py-1 rounded"
              required
            >
              <option value="Normal">Normal</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
            </select>
            <button
              type="button"
              onClick={() => removeHotel(idx)}
              className="text-red-500 text-sm"
            >
              Remove Hotel
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addHotel}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Add Hotel
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
};

export default AdminDayWiseDetailsForm;
