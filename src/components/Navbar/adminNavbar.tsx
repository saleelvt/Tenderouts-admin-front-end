/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Navbar.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@nextui-org/react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../reduxKit/store";
import Swal from "sweetalert2";
// import "../../CSS/logoHeading.css";
import { FaSignOutAlt } from "react-icons/fa";
import { adminLogout } from "../../reduxKit/actions/auth/authAction";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxKit/store";
import { FaArrowCircleLeft } from "react-icons/fa";


export const AdminNavbar: React.FC = () => {

  const { role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  console.log("this is my role  admin ", role);
  const handledata = async () => {
    try {
      await dispatch(adminLogout()).unwrap();
      Swal.fire({
        icon: "success",
        title: "Logged out successfully!",
        showConfirmButton: false,
        timer: 1000,
        toast: true,
      }).then(() => {
        navigate("/");
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Logout failed!",
        showConfirmButton: true,
        text: error.data,
      });
    }
  };
  return (
    <nav className="p-3">
      <div className="container py-2 mx-auto gap-3 flex justify-between items-center">
        <div className="w-full  flex items-center gap-20 ">
           <FaArrowCircleLeft
              className="text-3xl  items-center text-black-500"
              onClick={() => navigate("/")}
            />
          <h1 className=" font-semibold xs:font-bold lg:text-4xl md:text-2xl sm:1xl xs:text-2xl ">
            TendeRoutes{" "}
          </h1>
        </div>
        <div
          className={`lg:flex lg:items-center `}
        >
         
          <button
            onClick={handledata}
            className="bg-gradient-to-r from-green-900 via-green-800 to-green-700  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:scale-105   transition-transform duration-300 ease-in-out text-white shadow-lg px-4 flex items-center py-2  rounded-md"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
