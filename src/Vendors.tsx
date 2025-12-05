import { Box, Button, Card, Dialog, DialogContent, DialogTitle, MenuItem, TextField, Typography } from "@mui/material";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { GoogleGenAI } from '@google/genai';
import { json } from "stream/consumers";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
const categories = [
    "IT Services",
    "Logistics",
    "Hardware",
    "Consulting",
    "Marketing",
    "Others",
  ];

function Vendors() {     
const [search, setSearch] = useState("");
const [openCreate, setOpenCreate] = useState(false);
const [form, setForm] = useState({
  companyname: "",
  email: "",
  category: "",
  contactnumber: "",
  avgresponsetime:""
});
const handleSave = async () => {
    // Basic front-end validation
    if (!form.companyname || !form.email || !form.category || !form.contactnumber) {

      return;
    }

    setLoading1(true);
    try {
      await axios.post("http://localhost:5000/vendor/create", form);

      setForm({ companyname: "", email: "", category: "", contactnumber: "", avgresponsetime: "" });
      setOpenCreate(false);
    } catch (err: any) {
      
    }
    setLoading1(false);
  };

  const[result,setRes]=useState<any>([]);
  const[open,setOpen]=useState<boolean>(false);
  const[companyName,setCompanyName]=useState("");
  const[email,setEmail]=useState<String>("");
  const[desc,setdesc]=useState<String>("");
  const[rfp,setrfp]=useState<String>("");
  const[loading,setLoading]=useState<boolean>(false);
  const[loading1,setLoading1]=useState<boolean>(false);
  const navigate=useNavigate();
   function handleOpen(email:String,companyName:string) {
    console.log(companyName)
    setOpen(true);
    setEmail(email);
    setCompanyName(companyName);
  }

  function handleClose()
  {
    setrfp("");
    setOpen(false);
  }

  async function handleEmail(email:String,rfp:String,companyName:String){
    try{
        setLoading(true)
        const res=await axios.post("http://localhost:5000/Email/sendEmail",{vendorEmail:rfp,json:email,companyName:companyName});
        setLoading(false)
        if(res.status===200||res.status===201)
        {
            toast.success("Email sent successful!")
            setdesc("");
            setrfp("");
            handleClose();
            console.log("Email Sent Successfully!");
        }
    }
    catch(err:any)
    {
        console.log("Error"+err);

    }
  }

  async function handlerfp(desc:String)
  {
   setLoading1(true);
    const ai = new GoogleGenAI({ apiKey:"AIzaSyBmCOuyRqLi-o0TUNQTaCxiYoU_E7N1eLY" });
    const prompt = `
   Generate the JSON following:{
      "description": "${desc}"
    },JSON format only. No extra text.
    JSON must include:
     {
     "items":{
     name:string,
     quantity:String,
     specification:string
     }
     "Budget": string,
     "DeadLine": string,
     "PaymentTerms": string,
     "Warranty": string
     }
     fill relevant to description leave all the other fields
    `;
    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text = resp?.text?.trim();
    if (!text) {
      console.log("No text returned from Gemini API");
      return null;
    }

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const json=text.substring(jsonStart,jsonEnd+1)

    if (jsonStart === -1 || jsonEnd === -1) {
      console.log("No JSON object found in Gemini response");
      return null;
    }
    setrfp(json);
    setLoading1(false);
  }

  useEffect(()=>{
    async function getVendors()
    {
      try{
        const res=await axios.get("http://localhost:5000/vendor/getVendors");
        setRes(res.data);
      }
      catch(err:any)
      {
        console.log(err);
      }
    }
    getVendors();
  },[])
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "#f5f5f5",
        overflowX: "hidden",
        scrollbarWidth: "none",
      }}
    >
    <Navbar/>


      <Box sx={{ padding: "20px" }}>
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between", // <-- THIS FIXES IT
      alignItems: "center",
    }}
  >
    <div>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Vendor Management System
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: "bold", color: "gray" }}
      >
        Manage your vendor relationships and contact information
      </Typography>
    </div>

    <Button variant="contained" onClick={()=>setOpenCreate(true)}>
  + Add Vendor
</Button>

  </div>
</Box>
<Box sx={{padding:'20px'}}>
<input 
  type="search"
  style={{height:'35px',width:'400px'}}
  placeholder="🔍 Search vendors by name or category"
  onChange={(e)=>setSearch(e.target.value)}
/>
</Box>
<Box sx={{height:'20px'}}/>
<Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    p: 2,
  }}
>
{result?.vendorList
  ?.filter((v: any) =>
    v.companyname?.toLowerCase().includes(search.toLowerCase()) ||
    v.category?.toLowerCase().includes(search.toLowerCase())
  )
  .map((item: any) => (

    <Card
      key={item._id}
      sx={{
        width: "280px",
        p: 2,
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.12)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 6px 15px rgba(0,0,0,0.18)",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#333", mb: 1 }}
      >
        {item.companyname || item.username}
      </Typography>

      <Typography sx={{ fontSize: "14px", color: "gray" }}>
        📧 {item.email}
      </Typography>

      {item.category && (
        <Typography sx={{ fontSize: "14px", color: "#555", mt: 0.5 }}>
          🏷 Category: {item.category}
        </Typography>
      )}

      {item.contactnumber && (
        <Typography sx={{ fontSize: "14px", color: "#555", mt: 0.5 }}>
          📞 {item.contactnumber}
        </Typography>
      )}

      {item.avgresponsetime && (
        <Typography sx={{ fontSize: "14px", color: "#777", mt: 0.5 }}>
          ⏳ Avg Response: {item.avgresponsetime}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={()=>handleOpen(item.email,item.companyname)}
        sx={{ mt: 2, borderRadius: 2 }}
      >
        Send RFP
      </Button>
    </Card>
  ))}
</Box>
<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
  <DialogTitle>Create New RFP</DialogTitle>

  <DialogContent sx={{ mt: 1 }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      
      {/* Textarea */}
      <TextField
      onChange={(e)=>setdesc(e.target.value)}
        placeholder="Describe Your Requirements.Our AI will process and send the necessary data to the email"
        multiline
        rows={5}
        fullWidth
        variant="outlined"
      />
       <Button
       onClick={()=>handlerfp(desc)}
        variant="contained"
        sx={{ py: 1.2, fontSize: "16px", width:'190px' }}
      >
       {loading1?"loading...":"Generate RFP"}
      </Button>
      <TextField
        placeholder="Your Structured RFP"
        defaultValue={rfp}
        multiline
        rows={5}
        fullWidth
        variant="outlined"
      />
  
      {/* Send Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={()=>handleEmail(rfp,email,companyName)}
        sx={{ py: 1.2, fontSize: "16px" }}
      >
           {loading ? "SENDING EMAIL ... please wait" : "Send via Email"}
      </Button>
    </Box>
  </DialogContent>
</Dialog>
<Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Vendor</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Company Name"
              value={form.companyname}
              onChange={(e) => setForm({ ...form, companyname: e.target.value })}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
            />

            <TextField
              select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Contact Number"
              value={form.contactnumber}
              onChange={(e) => setForm({ ...form, contactnumber: e.target.value })}
              fullWidth
            />

            <TextField
              label="Avg Response Time (hrs)"
              value={form.avgresponsetime}
              onChange={(e) => setForm({ ...form, avgresponsetime: e.target.value })}
              fullWidth
            />

            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Vendor"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>







    </Box>
  );
}

export default Vendors;

