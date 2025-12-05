import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Vendors from "./Vendors";
import VendorResponsePage from "./VendorResponse";
import RFPPage from "./NewRfp";
import BulkProposals from "./BulkVendorResponse";
import VendorProposalResponseIndex from "./VendorResponseIndex";
import Home from "./Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendors" element={<Vendors/>}/>
        <Route path="/proposals" element={<VendorProposalResponseIndex/>}/>
        <Route path="/bulkproposal" element={<BulkProposals/>}/>
        <Route path="/newrfp" element={<RFPPage/>}/>
      </Routes>

      {/* Add this line to render toast notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
