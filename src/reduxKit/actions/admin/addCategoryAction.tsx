import axios  from "axios";
import { URL,config } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
// import { MyObject } from "../../../interfaces/admin/addDoument";


export const axiosIn = axios.create({
    baseURL: URL,
  });

  type CategoryType = "Normal" | "Premium" | "Luxury";

interface FormData {
  categoryType: CategoryType;
  adultCount: number;
  childCount: number;
  adultPrice: number;
  childPrice: number;
  maxAdults: number;
}
  

  export const addCategoryAction= createAsyncThunk(
    "admin/addDocument",
    async (Datas:FormData,{rejectWithValue})=>{
        try {
            console.log("this is for add category ",Datas);
            const response = await axiosIn.post(`/admin/addPackage`, Datas,config);
            return response.data ;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error.response) {
              return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "Something went wrong!" });
          }
    }
  )
