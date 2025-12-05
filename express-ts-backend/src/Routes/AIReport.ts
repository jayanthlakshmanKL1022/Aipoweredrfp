// src/Routes/AIReportRoute.ts

import { Router, Request, Response } from "express";
import { AIReportmodel } from "../Schema/Aireport";
import { GoogleGenAI } from "@google/genai";
const AIReportrouter = Router();
const GEMINI_API_KEY = "AIzaSyBmCOuyRqLi-o0TUNQTaCxiYoU_E7N1eLY";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

AIReportrouter.post("/aireports", async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderName, vendorReply } = req.body;

    if (!orderName || !vendorReply) {
      return res.status(400).json("Both orderName and vendorReply are required!");
    }

    // 1️⃣ Check if report already exists
    const existing = await AIReportmodel.findOne({ orderName });
    if (existing) {
      return res.status(200).json({
        message: "Report already exists",
        report: existing,
      });
    }

    // 2️⃣ Gemini prompt
    const prompt = `
      You are an AI RFP Analyzer.

      Analyze the following:
      Order Name: ${orderName}
      Vendor Reply: ${vendorReply}

      Generate STRICT VALID JSON ONLY:
      provide your view points on the suggestion,alternative and summary,provide in the below format
      provide a short answer dont think too much and provide your views on suggestions,alternatives and summary
      add solid points

      {
        "suggestion": "",
        "alternates": "",
        "summary": ""
      }
    `;

    // 3️⃣ Call Gemini API
    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = resp?.text?.trim();
    console.log("Gemini Response:", text);

    if (!text) {
      return res.status(500).json("AI did not return any content");
    }

   
    text = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON:", text);
      return res.status(500).json({
        error: "Gemini responded with invalid JSON",
        raw: text,
      });
    }

    // 4️⃣ Save to DB
    const saved = await AIReportmodel.create({
      orderName,
      vendorReply,
      suggestion: parsed.suggestion,
      alternates: parsed.alternates,
      summary: parsed.summary,
    });

    return res.status(200).json({
      message: "AI Report Generated & Saved Successfully",
      report: saved,
    });

  } catch (err: any) {
    console.error("AI Error:", err);
    return res.status(500).json({
      error: "AI generation failed",
      details: err.message,
    });
  }
});

export default AIReportrouter;
