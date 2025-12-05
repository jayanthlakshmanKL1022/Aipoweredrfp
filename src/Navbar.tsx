import React from "react";
import { Card, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

export default function Navbar() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon sx={{ fontSize: 24 }} /> },
    { label: "Vendors", path: "/vendors", icon: <StoreIcon sx={{ fontSize: 24 }} /> },
    { label: "Responses", path: "/proposals", icon: <ChatBubbleIcon sx={{ fontSize: 24 }} /> },
    { label: "Create RFP", path: "/newrfp", icon: <NoteAddIcon sx={{ fontSize: 24 }} /> },
  ];

  return (
    <>
 
    <Card
      sx={{
        width: "100%",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 25px",
        bgcolor: "#1f2937",
        color: "white",
        boxShadow: 3,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT - LOGO */}
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ letterSpacing: 1, cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        RFP MANAGER
      </Typography>

      {/* RIGHT - MENU */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 5,marginRight:'80px' }}>
        {menuItems.map((item, index) => (
          <Box
            key={index}
            onClick={() => navigate(item.path)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": { color: "#60a5fa", transform: "translateY(-2px)" },
            }}
          >
            {item.icon}
            <Typography sx={{ fontSize: 12, mt: 0.3 }}>{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
    </>
  );
}
