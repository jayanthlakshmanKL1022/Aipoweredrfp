import { Box, AppBar, Toolbar, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React from "react";
import { useState } from "react";
import BulkProposals from "./BulkVendorResponse";
import VendorResponsePage from "./VendorResponse";
import Navbar from "./Navbar";

export default function VendorProposalResponseIndex() {
  const [view, setView] = useState("individual");

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f6fa" }}>
      {/* NAVBAR */}
    <Navbar/>

      {/* CONTENT WRAPPER */}
      <Box sx={{ p: 4}}>
        {/* DROPDOWN */}
        <Box sx={{ maxWidth: 300, mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Choose Response Type</InputLabel>
            <Select
              label="Choose Response Type"
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <MenuItem value="individual">Individual Proposal Response</MenuItem>
              <MenuItem value="bulk">Bulk Proposal Response</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* CONDITIONAL RENDERING */}
        <Box>
          {view === "individual" && <VendorResponsePage/>}
          {view === "bulk" && <BulkProposals />}
        </Box>
      </Box>
    </Box>
  );
}