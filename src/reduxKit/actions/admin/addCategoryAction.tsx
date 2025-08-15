import axios  from "axios";
import { URL,config } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";



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
  packageName:string;
  description:string;
}


  export const addCategoryAction= createAsyncThunk(
    "admin/addPackage",
    async (Datas:FormData,{rejectWithValue})=>{
        try {
            console.log("this is for add category ",Datas);
            const response = await axiosIn.post(`/admin/addPackage`, Datas,config);
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
    export const admingGetPackages= createAsyncThunk(
    "admin/admingGetPackages",
    async (_,{rejectWithValue})=>{
        try {
            const response = await axiosIn.get(`/admin/getPackages`,config);
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


  export const deleteCategoryAction= createAsyncThunk(
    "admin/deletePackage",
    async (id:string,{rejectWithValue})=>{
        try {
            console.log("before delete the package ",id);
            const response = await axiosIn.delete(`/admin/deletePackage/${id}`,config);
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


