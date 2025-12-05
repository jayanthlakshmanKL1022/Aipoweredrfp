import React, { useEffect, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import Navbar from "./Navbar";

export default function VendorResponsePage() {
  const [proposals, setProposals] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogData, setDialogData] = useState<any>(null);

  const [selectedOrderName, setSelectedOrderName] = useState("");
  const [vendorReply, setVendorReply] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/email/proposals");
        setProposals(res.data.records || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // ---------------------------------------
  // Open dialog → Fetch AI Report
  // ---------------------------------------
  const handleOpenDialog = async (orderName: string, vendorResponse: string) => {
    setSelectedOrderName(orderName);
    setVendorReply(vendorResponse);

    setOpenDialog(true);
    setDialogLoading(true);
    setDialogData(null);

    try {
      const res = await axios.post("http://localhost:5000/reports/aireports", {
        orderName: orderName,
        vendorReply: vendorResponse,
      });

      setDialogData(res.data.report);
    } catch (err) {
      console.error(err);
      setDialogData({ error: "Failed to generate AI report" });
    }

    setDialogLoading(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f6fa", p: 0,overflowX:'hidden' }}>
    
      {/* MAIN PAGE */}
      <Box sx={{ padding:"5px"}}>
        <Typography variant="h5" fontWeight={700} mb={4} color="#333">
          Vendor Proposal Responses
        </Typography>

        {loading ? (
          <Typography color="gray">Loading proposals...</Typography>
        ) : proposals.length === 0 ? (
          <Typography color="gray">No proposals found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {proposals.map((p, idx) => (
              <Grid key={idx}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <PersonIcon sx={{ color: "#1976d2" }} />
                      <Typography variant="h6" fontWeight={600}>
                        {p.vendorName || "Unknown Vendor"}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} color="gray" mb={2}>
                      <MailIcon fontSize="small" />
                      <Typography>{p.VendorEmail}</Typography>
                    </Box>

                    <Box
                      sx={{
                        background: "#f0f0f0",
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <DescriptionIcon fontSize="small" />
                        <Typography fontWeight={600}>Order Name</Typography>
                      </Box>
                      <Typography mt={1} color="#333">
                        {p.orderName}
                      </Typography>
                    </Box>

                    <Box sx={{ border: "1px solid #e0e0e0", p: 2, borderRadius: 2, mb: 2 }}>
                      <Typography fontWeight={600}>Subject</Typography>
                      <Typography mt={1} color="gray">
                        {p.Subject}
                      </Typography>
                    </Box>

                    <Box sx={{ border: "1px solid #e0e0e0", p: 2, borderRadius: 2, mb: 2 }}>
                      <Typography fontWeight={600}>Content</Typography>
                      <Typography mt={1} color="gray">
                        {p.content}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        background: "#e8f2ff",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #bbd4f7",
                      }}
                    >
                      <Typography fontWeight={600} color="#0d47a1">
                        Vendor Reply
                      </Typography>
                      <Typography mt={1} color="#0d47a1">
                        {p.replyByVendor}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, background: "green" }}
                      onClick={() =>
                        handleOpenDialog(p.orderName, p.replyByVendor)
                      }
                    >
                      Generate AI Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* AI REPORT DIALOG */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>AI Generated Report</DialogTitle>
        <DialogContent dividers>
          {dialogLoading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : dialogData ? (
            dialogData.error ? (
              <Typography color="red">{dialogData.error}</Typography>
            ) : (
              <Box>

                {/* ORDER NAME */}
                <Typography fontWeight={700}>Order Name:</Typography>
                <Typography mb={3}>{selectedOrderName}</Typography>

                {/* SUGGESTION */}
                <Box
                  sx={{
                    background: "#f9fff1",
                    p: 2,
                    borderLeft: "4px solid #a3d33c",
                    mb: 3,
                  }}
                >
                  <Typography fontWeight={700}>Suggestion</Typography>
                  <Typography mt={1}>{dialogData.suggestion}</Typography>
                </Box>

                {/* ALTERNATES */}
                <Box
                  sx={{
                    background: "#f0f5ff",
                    p: 2,
                    borderLeft: "4px solid #4d79ff",
                    mb: 3,
                  }}
                >
                  <Typography fontWeight={700}>Alternates</Typography>
                  <Typography mt={1}>{dialogData.alternates}</Typography>
                </Box>

                {/* SUMMARY */}
                <Box
                  sx={{
                    background: "#fff5f5",
                    p: 2,
                    borderLeft: "4px solid #ff6b6b",
                    mb: 3,
                  }}
                >
                  <Typography fontWeight={700}>Summary</Typography>
                  <Typography mt={1}>{dialogData.summary}</Typography>
                </Box>
              </Box>
            )
          ) : (
            <Typography>No data.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
