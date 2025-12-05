import express from "express";
import mongoose from "mongoose";
import VendorRouter, { createVendor } from "./Routes/VendorManagement";
import cron from "node-cron";
import cors from "cors";
import EmailToVendor from "./Routes/EmailToVendor";
import { AIReport } from "./Schema/Aireport";
import AIReportrouter from "./Routes/AIReport";

const app = express();
app.use(express.json());

const MONGO_URL = "mongodb+srv://jayanthlakshman168_db_user:sample@cluster0.hi8an81.mongodb.net/?appName=Cluster0";


app.use(cors({
  origin: "*",
  methods: "*",
  allowedHeaders: "*",
}));

//Leaving this for debugging Purpose I KNOW that critical info should be added to env.

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/vendor",VendorRouter)
app.use('/email',EmailToVendor)
app.use('/reports',AIReportrouter)

// cron jobs have been written to make it more realistic.

cron.schedule("*/1 * * * *", async () => {
  console.log("Cron job started: Generating vendor...");

  try {
    const vendor = await createVendor();
    if (vendor) {
      console.log("Vendor created successfully at", new Date().toLocaleString());
    } else {
      console.log("Vendor creation failed or returned null.");
    }
  } catch (err) {
    console.log("Error in cron job:", err);
  }
});

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

