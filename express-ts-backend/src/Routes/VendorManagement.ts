import { Router } from 'express';
const VendorRouter = Router();
import { Request,Response } from 'express';
import { VendorModel } from '../Schema/Vendors';
import { GoogleGenAI } from '@google/genai';

VendorRouter.post("/create",async(req:Request,res:Response)=>{
    const{companyname,category,email,contactnumber,avgresponsetime}=req.body;
    if(!companyname||!category||!email||!contactnumber||!avgresponsetime)
    {
        return res.status(404).json("one of the essential fields are missing");
    }
    else{
        const newVendor=new VendorModel({
            companyname,category,email,contactnumber,avgresponsetime
        })
        await newVendor.save();
        return res.status(201).json("Vendor has been Created Successfully!");
    }
})

VendorRouter.get("/getVendors",async(req:Request,res:Response)=>{
    try{
        const vendorList=await VendorModel.find();
        return res.status(200).json({vendorList});
    }
    catch(err:any)
    {
        return res.status(500).json("Internal Server Error!");
    }
})

//Writing cron job inorder to create a vendor dynamically and storing in DB inorder to make things realistic.
//the function for cron Job.
const GEMINI_API_KEY = "AIzaSyBmCOuyRqLi-o0TUNQTaCxiYoU_E7N1eLY";
export const createVendor = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const prompt = `
Generate a single vendor in strict JSON format only. No extra text.
JSON must include:
{
  "companyname": string,
  "category": string,
  "email": string,
  "contactnumber": string,
  "avgresponsetime": string
}
Make realistic and random values.
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
    if (jsonStart === -1 || jsonEnd === -1) {
      console.log("No JSON object found in Gemini response");
      return null;
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);

    let vendor;
    try {
      vendor = JSON.parse(jsonString);
    } catch {
      console.log("Failed to parse JSON from Gemini response");
      return null;
    }

    vendor.companyName = vendor.companyName || "Unknown Company";
    vendor.category = vendor.category || "General";
    vendor.email = vendor.email || "example@example.com";
    vendor.contactNumber = vendor.contactNumber || "0000000000";
    vendor.avgResponseTime = vendor.avgResponseTime || 24; 
    //fallbacks have been added for failures.
    console.log("Generated Vendor JSON:", vendor);
    // Save to MongoDB
    const savedVendor = await VendorModel.create(vendor);
    console.log("Vendor saved to DB:", savedVendor);
    return savedVendor;
  } catch (err) {
    console.log("Error creating vendor:", err);
    return null;
  }
};


  
  export default VendorRouter;
