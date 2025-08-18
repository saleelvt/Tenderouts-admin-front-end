/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../reduxKit/store";
import toast from "react-hot-toast";
import { AdminNavbar } from "../../Navbar/adminNavbar";
import { AdminAddDayWisePackageAction } from "../../../reduxKit/actions/admin/addDayWisePackageAction";
import { admingGetPackages } from "../../../reduxKit/actions/admin/addCategoryAction";

type HotelCategory = "Normal" | "Premium" | "Luxury";

interface Activity {
  day: number;
  destination: string;
  description: string;
  time: string;
  imageUrl: string;
}

interface Hotel {
  name: string;
  location: string;
  category: HotelCategory;
}

interface FormData {
  packageId: string;
  dayNumber: number;
  activities: Activity[];
  hotels: Hotel[];
  priceIncludes: string[];
  priceExcludes: string[];
}

interface PackageOption {
  _id: string;
  packageName: string;
}

const DAY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 5); // [5..14]

const AdminDayWiseDetailsForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    packageId: "",
    dayNumber: 5,
    activities: [],
    hotels: [{ name: "", location: "", category: "Normal" }],
    priceIncludes: [""],
    priceExcludes: [""],
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch packages at start for dropdown
  useEffect(() => {
    const fetchPackages = async () => {
      setLoadingPackages(true);
      try {
        const response = await dispatch(admingGetPackages()).unwrap();
        if (response.success && Array.isArray(response.data)) {
          setPackages(response.data.map((pkg: any) => ({
            _id: pkg._id,
            packageName: pkg.packageName || pkg.categoryType || pkg._id,
          })));
        }
      } catch (error:any) {
        toast.error("Failed to load packages.",error);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, [dispatch]);

  // Initialize activities array when dayNumber changes
  useEffect(() => {
    const newActivities: Activity[] = [];
    for (let i = 1; i <= formData.dayNumber; i++) {
      const existing = formData.activities[i - 1];
      newActivities.push({
        day: i,
        destination: existing?.destination || "",
        description: existing?.description || "",
        time: existing?.time || "",
        imageUrl: existing?.imageUrl || "",
      });
    }
    setFormData(prev => ({ ...prev, activities: newActivities }));
  }, [formData.dayNumber]);

  // Validation helper - ensure all required fields for activities
  const validateForm = () => {
    if (!formData.packageId) {
      toast.error("Please select a Package ID.");
      return false;
    }
    if (
      formData.activities.some(
        act =>
          !act.destination.trim() ||
          !act.description.trim() ||
          !act.time.trim() ||
          !act.imageUrl.trim()
      )
    ) {
      toast.error(
        "Please fill all fields in all activities (day destination, description, time, image URL)."
      );
      return false;
    }
    if (
      formData.hotels.some(
        hotel =>
          !hotel.name.trim() || !hotel.location.trim() || !hotel.category.trim()
      )
    ) {
      toast.error("Please fill all hotel fields (name, location, category).");
      return false;
    }
    if (formData.priceIncludes.some(item => !item.trim())) {
      toast.error("Please fill all 'Price Includes' points.");
      return false;
    }
    if (formData.priceExcludes.some(item => !item.trim())) {
      toast.error("Please fill all 'Price Excludes' points.");
      return false;
    }
    return true;
  };

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "dayNumber") {
      const num = Number(value);
      if (num >= 5 && num <= 14) {
        setFormData(prev => ({
          ...prev,
          dayNumber: num,
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleActivityChange = (
    index: number,
    field: keyof Omit<Activity, "day">,
    value: string
  ) => {
    const updated = [...formData.activities];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, activities: updated }));
  };

  const handleHotelChange = (
    index: number,
    field: keyof Hotel,
    value: string
  ) => {
    const updated = [...formData.hotels];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, hotels: updated }));
  };

  const addHotel = () => {
    setFormData(prev => ({
      ...prev,
      hotels: [...prev.hotels, { name: "", location: "", category: "Normal" }],
    }));
  };

  const removeHotel = (index: number) => {
    setFormData(prev => {
      const updated = [...prev.hotels];
      if (updated.length > 1) {
        updated.splice(index, 1);
      }
      return { ...prev, hotels: updated };
    });
  };

  const handlePriceIncludeChange = (index: number, value: string) => {
    setFormData(prev => {
      const updated = [...prev.priceIncludes];
      updated[index] = value;
      return { ...prev, priceIncludes: updated };
    });
  };
  const addPriceInclude = () => {
    setFormData(prev => ({ ...prev, priceIncludes: [...prev.priceIncludes, ""] }));
  };
  const removePriceInclude = (index: number) => {
    setFormData(prev => {
      const updated = [...prev.priceIncludes];
      if (updated.length > 1) {
        updated.splice(index, 1);
      }
      return { ...prev, priceIncludes: updated };
    });
  }; 

  const handlePriceExcludeChange = (index: number, value: string) => {
    setFormData(prev => {
      const updated = [...prev.priceExcludes];
      updated[index] = value;
      return { ...prev, priceExcludes: updated };
    });
  };
  const addPriceExclude = () => {
    setFormData(prev => ({ ...prev, priceExcludes: [...prev.priceExcludes, ""] }));
  };
  const removePriceExclude = (index: number) => {
    setFormData(prev => {
      const updated = [...prev.priceExcludes];
      if (updated.length > 1) {
        updated.splice(index, 1);
      }
      return { ...prev, priceExcludes: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const res = await dispatch(AdminAddDayWisePackageAction(formData)).unwrap();
      if (res.success) {
        toast.success(res.message);
        setFormData({
          packageId: "",
          dayNumber: 5,
          activities: Array(5)
            .fill(null)
            .map((_, i) => ({
              day: i + 1,
              destination: "",
              description: "",
              time: "",
              imageUrl: "",
            })),
          hotels: [{ name: "", location: "", category: "Normal" }],
          priceIncludes: [""],
          priceExcludes: [""],
        });
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to add day-wise package.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 mt-3 bg-white rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-green-800 text-center mb-4">Add Day-Wise Package Details</h2>

        {/* Package ID/Day Number fields (2 columns) */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1">Package ID</span>
            {loadingPackages ? (
              <div className="flex items-center gap-2 py-1 px-2 border border-gray-300 rounded">
                <svg className="animate-spin h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              <select
                name="packageId"
                value={formData.packageId}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-xs"
                required
              >
                <option value="">Select a Package</option>
                {packages.map(pkg => (
                  <option key={pkg._id} value={pkg._id}>{pkg.packageName}</option>
                ))}
              </select>
            )}
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1">Day Number</span>
            <select
              name="dayNumber"
              value={formData.dayNumber}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-xs"
            >
              {DAY_OPTIONS.map(day => (
                <option key={day} value={day}>{day} Days</option>
              ))}
            </select>
          </label>
        </div>

        {/* Activities as grid: 1 row per activity, each has 3 columns */}
        <div>
          <h3 className="font-semibold mb-2 text-md">Daily Activities</h3>
          <div className="space-y-2">
            {formData.activities.map((activity, idx) => (
              
              <div key={idx} className="grid grid-cols-3 gap-2 bg-green-50 p-2 rounded">
                
                   <div className="p-2"><span className="font-semibold text-xs mb-1">Day {activity.day}</span></div>
                <div className="flex flex-col">
                  
                  <input
                    type="text"
                    value={activity.destination}
                    onChange={e => handleActivityChange(idx, "destination", e.target.value)}
                    className="p-2 border border-gray-300 rounded text-xs mb-1"
                    required
                    placeholder={`Destination`}
                  />
                  <textarea
                    value={activity.description}
                    onChange={e => handleActivityChange(idx, "description", e.target.value)}
                    className="p-2 border border-gray-300 rounded text-xs mb-1"
                    rows={2}
                    required
                    placeholder="Description"
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={activity.time}
                    onChange={e => handleActivityChange(idx, "time", e.target.value)}
                    className="p-2 border border-gray-300 rounded text-xs mb-1"
                    required
                    placeholder="Time (e.g. 09:00 AM - 11:00 AM)"
                  />
                  <input
                    type="text"
                    value={activity.imageUrl}
                    onChange={e => handleActivityChange(idx, "imageUrl", e.target.value)}
                    className="p-2 border border-gray-300 rounded text-xs mb-1"
                    required
                    placeholder="Image URL (https://...)"
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span className="text-xs text-gray-400 italic">Fill out all fields</span>
                </div>
               
              </div>
            ))}
          </div>
        </div>

        {/* Hotels: grid, each hotel is one row with 3 columns */}
        <div>
          <h3 className="font-semibold mb-2 text-md">Hotels</h3>
          <div className="space-y-2">
            {formData.hotels.map((hotel, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 bg-green-50 p-2 rounded">
                <input
                  type="text"
                  value={hotel.name}
                  onChange={e => handleHotelChange(idx, "name", e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs mb-1"
                  required
                  placeholder="Hotel Name"
                />
                <input
                  type="text"
                  value={hotel.location}
                  onChange={e => handleHotelChange(idx, "location", e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs mb-1"
                  required
                  placeholder="Location"
                />
                <select
                  value={hotel.category}
                  onChange={e => handleHotelChange(idx, "category", e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs"
                  required
                >
                  <option value="Normal">Normal</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeHotel(idx)}
                  className="ml-2 text-red-600 hover:text-red-800 font-semibold"
                  disabled={formData.hotels.length === 1}
                  title="Remove Hotel"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addHotel}
            className="bg-green-600 text-white px-2 py-1 mt-2 rounded text-xs"
          >
            + Add Hotel
          </button>
        </div>

        {/* Price Includes/Excludes sections - minimal rows */}
        <div>
          <h3 className="font-semibold mb-2 text-md">Price Includes</h3>
          <div className="flex flex-wrap gap-2">
            {formData.priceIncludes.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="text"
                  value={item}
                  onChange={e => handlePriceIncludeChange(i, e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs"
                  placeholder={`Include #${i + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removePriceInclude(i)}
                  className="text-red-600 hover:text-red-800 select-none px-1"
                  disabled={formData.priceIncludes.length === 1}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPriceInclude}
              className="bg-green-600 text-white px-2 py-1 rounded text-xs"
            >
              + Add
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-md">Price Excludes</h3>
          <div className="flex flex-wrap gap-2">
            {formData.priceExcludes.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="text"
                  value={item}
                  onChange={e => handlePriceExcludeChange(i, e.target.value)}
                  className="p-2 border border-gray-300 rounded text-xs"
                  placeholder={`Exclude #${i + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removePriceExclude(i)}
                  className="text-red-600 hover:text-red-800 select-none px-1"
                  disabled={formData.priceExcludes.length === 1}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPriceExclude}
              className="bg-green-600 text-white px-2 py-1 rounded text-xs"
            >
              + Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-700 text-white py-2 rounded-lg text-md hover:bg-green-800 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default AdminDayWiseDetailsForm;
