import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Paper,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Card,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { toast } from "react-toastify";



export default function RFPPage() {
  const navigate=useNavigate();
  const[loading1,setLoading1]=useState<boolean>(false)
  const [desc, setDesc] = useState("");
  const [rfp, setRfp] = useState("");
  const [parsed, setParsed] = useState<any>(null);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [vendors, setVendors] = useState<any>([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/vendor/getVendors");
        setVendors(res.data.vendorList || []);
      } catch (err) {
        console.error("Could not load vendors:", err);
      }
    };

    loadVendors();
  }, []);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOptions(typeof value === "string" ? value.split(",") : value);
  };

  const generateRFP = async () => {
    if (!desc.trim()) {
      alert("Please describe your requirements.");
      return;
    }

    setLoading(true);

    try {
      const ai = new GoogleGenAI({
        apiKey: "AIzaSyBmCOuyRqLi-o0TUNQTaCxiYoU_E7N1eLY",
      });

      const prompt = `
        Generate a STRICT VALID JSON ONLY. No markdown. No commentary.
        Input:
        { "description": "${desc}" }

        Required Output JSON:
        {
          "items": {
            "name": string,
            "quantity": string,
            "specification": string
          },
          "Budget": string,
          "DeadLine": string,
          "PaymentTerms": string,
          "Warranty": string
        }

        If any field is not found in description, return an empty string "".
      `;

      const resp = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = resp?.text?.trim() || "";

      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      setRfp(cleaned);

      try {
        const json = JSON.parse(cleaned);
        setParsed(json);
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    } catch (err) {
      console.error("Error generating RFP:", err);
    }

    setLoading(false);
  };

  const sendEmail = async () => {
    console.log(selectedVendor)
    if (!parsed) return alert("Generate RFP first!");
    if (selectedVendors.length===0) return alert("Please select a vendor!");

    try {
        setLoading1(true)
      const res=await axios.post("http://localhost:5000/Email/sendbulkemail", {
        vendorEmail: selectedVendors,
        rpf: parsed,
      });
      if(res.status===200||res.status===201)
      {
        toast.success("Bulk Email is Successful!");
        navigate("/proposals");

      }
      
    } catch (error) {
      console.error("Send email failed:", error);
      alert("Failed to send RFP email.");
    }
  };

  return (
    <>
   <Navbar/>
    <Box
      sx={{
        maxWidth: 900,
        margin: "auto",
        mt: 5,
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >

      <Typography variant="h4" fontWeight={600} gutterBottom>
        Create New RFP
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Describe your requirements, choose categories, and generate a structured RFP automatically using AI.
      </Typography>

      
      <TextField
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Describe your requirements…"
        multiline
        rows={5}
        fullWidth
        variant="outlined"
        sx={{ mb: 3 }}
      />

     
      <FormControl fullWidth sx={{ mb: 3 }}>
  <InputLabel>Select Vendor</InputLabel>
  <Select
    multiple
    label="Select Vendor"
    value={selectedVendors} 
    onChange={(e) => setSelectedVendors(e.target.value as string[])}
    renderValue={(selected) => selected.join(", ")}
  >
    {vendors.map((vendor) => (
      <MenuItem key={vendor._id} value={vendor.companyname+"("+vendor.email+")"}>
        <Checkbox checked={selectedVendors.indexOf(vendor.companyname+"("+vendor.email+")") > -1} />
        <ListItemText primary={`${vendor.companyname} (${vendor.category})`} />
      </MenuItem>
    ))}
  </Select>
</FormControl>
      <Button
        variant="contained"
        sx={{ py: 1.2, fontSize: "16px", mb: 3, width: "200px" }}
        onClick={generateRFP}
      >
        {loading ? "Generating..." : "Generate RFP"}
      </Button>

 
      {parsed && (
        <Paper elevation={4} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            📄 Structured RFP Summary
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Items Section */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Item Details
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Specification</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{parsed.items?.name || "-"}</TableCell>
                <TableCell>{parsed.items?.quantity || "-"}</TableCell>
                <TableCell>{parsed.items?.specification || "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Divider sx={{ my: 3 }} />

          {/* Additional Fields */}
          <Typography variant="h6">Additional Details</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography><strong>Budget:</strong> {parsed.Budget || "-"}</Typography>
            <Typography><strong>Deadline:</strong> {parsed.DeadLine || "-"}</Typography>
            <Typography><strong>Payment Terms:</strong> {parsed.PaymentTerms || "-"}</Typography>
            <Typography><strong>Warranty:</strong> {parsed.Warranty || "-"}</Typography>
          </Box>
        </Paper>
      )}

      {/* ================== Send Button ================== */}
      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ py: 1.2, fontSize: "16px" }}
        onClick={sendEmail}
      >
        {loading1?"Sending ... Please Wait":"Send RPF"}
      </Button>
    </Box>
    </>
  );
}
