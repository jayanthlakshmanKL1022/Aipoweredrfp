import { Box, Button, Typography, Grid, Card, CardContent } from "@mui/material";

import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
    <Navbar/>
    <Box sx={{ minHeight: "100vh", background: "#f8f9fc" }}>
      <Box
        sx={{
          p: 6,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Text Area */}
        <Box sx={{ maxWidth: 500 }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            Smart Vendor Proposal System
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, color: "#555" }}>
            Send proposals individually or in bulk, track responses, and let AI analyze vendors for you—all in one place.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: 2, mr: 2 }}
            onClick={() => navigate("/vendor/send")}
          >
            Get Started
          </Button>
        </Box>

        {/* Hero Image */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
          sx={{
            width: { xs: "100%", md: "45%" },
            borderRadius: 3,
            boxShadow: 3,
            mt: { xs: 4, md: 0 },
          }}
        />
      </Box>

      {/* HOW IT WORKS SECTION */}
      <Box sx={{ textAlign: "center", mt: 6, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          How the App Works
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ px: 6, mb: 6 }}>
        <Grid >
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                1️⃣ Send Individual Proposals
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Choose a specific vendor and send a well-formatted proposal directly to them.
              </Typography>
              <Button
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => navigate("/vendors")}
              >
                Go to Individual Proposal →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid >
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                2️⃣ Send Bulk Proposals
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select multiple vendors at once and send proposals in bulk—
                perfect for large procurements.
              </Typography>
              <Button
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => navigate("/newrfp")}
              >
                Go to Bulk Proposal →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid >
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                3️⃣ View Responses
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and review all individual and bulk vendor responses in a single dashboard.
              </Typography>
              <Button
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => navigate("/proposals")}
              >
                View Responses →
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI ANALYSIS SECTION */}
      <Box
        sx={{
          p: 6,
          background: "#fff",
          borderTop: "1px solid #e5e5e5",
          borderBottom: "1px solid #e5e5e5",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          Powered by AI
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto", color: "#444" }}>
          The system automatically analyzes all vendor replies, extracts insights,
          evaluates pricing, timelines, compliance, and produces a clean summary.
        </Typography>

        <Box
          component="img"
          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900"
          sx={{
            width: "60%",
            mx: "auto",
            mt: 4,
            borderRadius: 3,
            boxShadow: 4,
          }}
        />
      </Box>

      {/* FOOTER */}
      <Box sx={{ py: 4, textAlign: "center", color: "#777" }}>
        <Typography variant="body2">© 2025 Vendor Proposal AI System</Typography>
      </Box>
    </Box>
    </>
  );
}
