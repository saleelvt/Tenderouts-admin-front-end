import axios  from "axios";
import { URL,config } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
// import { MyObject } from "../../../interfaces/admin/addDoument";


export const axiosIn = axios.create({
    baseURL: URL,
  });

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

  export const AdminAddDayWisePackageAction= createAsyncThunk(
    "admin/addDayDetailedPackage",
    async (Datas:FormData,{rejectWithValue})=>{
        try {
            console.log("this if day wise adding ",Datas);
            const response = await axiosIn.post(`/admin/addDayDetailedPackage`, Datas,config);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error.response) {
              return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "Something went wrong!" });
          }
    }
  )
