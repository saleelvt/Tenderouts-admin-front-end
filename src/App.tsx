// src/App.tsx
import React, { Fragment, Suspense } from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loading } from './components/pages/Loading';


import { AdminLogin } from './components/forms/admin/login';
import AdminHomePage from './components/pages/admin/adminDashBoard';
import AdminCategoryPriceForm from './components/pages/admin/addPackageCategory';
import AdminDayWiseDetailsForm from './components/pages/admin/adminAddDayWisePackage';

import { useSelector } from 'react-redux';
import { RootState } from './reduxKit/store';

export const App: React.FC = React.memo(() => {

  const {isLogged,role,}=useSelector((state:RootState)=>state.auth)
  console.log("my role and my isLogged", isLogged,role);

  return (
    <Fragment>
      <Toaster position="top-center" />
      {/* Wrap Routes in Suspense for lazy-loaded components */}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={isLogged && role === 'admin' ? <Navigate to="/adminHomepage" /> : <AdminLogin />} />
          <Route path="/adminHomepage" element={isLogged && role === 'admin' ? <AdminHomePage /> : <AdminLogin />} />
          <Route path="/adminAddCategoryPackage" element={isLogged && role === 'admin' ? <AdminCategoryPriceForm /> : <AdminLogin />} />
          <Route path="/adminAddDayWisePackage" element={isLogged && role === 'admin' ? <AdminDayWiseDetailsForm /> : <AdminLogin />} />
    
        </Routes>
      </Suspense>
    </Fragment>
  );
});
