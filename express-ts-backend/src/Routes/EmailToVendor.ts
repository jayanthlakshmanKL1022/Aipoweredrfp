// src/Routes/EmailToVendor.ts
import { Router } from 'express';
import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { EmailModel } from '../Schema/EmailtoVendor'
import nodemailer from "nodemailer";
import { EmailBulkModel, EmailToBulkVendorSchema } from '../Schema/EmailToBulkVendor';

const EmailToVendorRouter = Router();
const GEMINI_API_KEY = "AIzaSyBmCOuyRqLi-o0TUNQTaCxiYoU_E7N1eLY";

EmailToVendorRouter.post("/sendEmail", async (req: Request, res: Response) => {
    try {
        const { json, vendorEmail,companyName } = req.body;

        if(!json||!vendorEmail||!companyName)
        {
            return res.status(404).json("Json,rfp,companyName and vendor Email is necessary")
        }
        console.log(companyName)

        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        const prompt = `
        Generate STRICT VALID JSON ONLY using details from: ${JSON.stringify(json)}.
          No explanation. No markdown. No extra words.

Write:
- orderName
- Subject
- content
- replyByVendor

Professional tone.
replyByVendor must have emotional realistic bargaining tone and provide with a counter offer and some statistics Data.

FINAL OUTPUT MUST ALWAYS BE JSON:
{
  "orderName": "",
  "Subject": "",
  "content": "",
  "replyByVendor": ""
}
`;

        const resp = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const text = resp?.text?.trim();
        console.log("Gemini Response:", text);

        if (!text) {
            return res.status(404).json("Reply Not Found!");
        }

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (err) {
            console.error("Gemini invalid JSON:", text);
            return res.status(500).json({ error: "AI returned invalid JSON", text });
        }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "thelegacy1022@gmail.com",
              pass: "wubt xmek cisp vfbw",
            },
          });
    
          // Email Contents
          const mailOptions = {
            from: "thelegacy1022@gmail.com",
            to: vendorEmail,
            subject: `Regarding Proposal`,
            html: `
                <h2>Proposal Details</h2>
                <b>${parsed.orderName}</b>
                <p>${parsed.content}</p>`
          };
    
          await transporter.sendMail(mailOptions);
     //using email.js to send a email from an account to target Vendor Account.


        // Save into DB
        const emailRecord = new EmailModel({
            json: JSON.stringify(json),
            orderName: parsed.orderName,
            vendorName:companyName,
            VendorEmail: vendorEmail,
            Subject: parsed.Subject,
            content: parsed.content,
            replyByVendor: parsed.replyByVendor
        });

        await emailRecord.save();

        return res.status(200).json("Email Sent Successfully!");
    }
    catch (err: any) {
        console.error(err);
        return res.status(500).json("Internal Server Error!");
    }
});

//ADDING EMAIL FUNCTIONALITY TO BULK VENDORS....
EmailToVendorRouter.post("/sendbulkemail", async (req: Request, res: Response) => {
    try {
      const { rpf, vendorEmail } = req.body;
      console.log(rpf)
     console.log(vendorEmail)
      if (!rpf || !vendorEmail || !Array.isArray(vendorEmail) || vendorEmail.length === 0) {
        return res.status(400).json({
          error: "rpf and vendorList (as a non-empty array) are required",
        });
      }
  
      // Convert vendor string ("Name(email)") → object
      const parseVendors = vendorEmail.map((v: string) => {
        const name = v.substring(0, v.indexOf("(")).trim();
        const email = v.substring(v.indexOf("(") + 1, v.indexOf(")")).trim();
        return { name, email };
      });
  
      // AI prompt
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const prompt = `
        You are a professional email generator for RFP communication.
  
        Generate an email for:
  
        RPF Details: ${JSON.stringify(rpf)}
  
        Respond with STRICT VALID JSON:
        {
          "orderName":"generate order name with regard to rpf details",
          "subject": "email subject generate with regard to rpf details",
          "content": "professional email content with regard to rpf details"
        }
      `;
  
      const resp = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
  
      let text = resp?.text?.trim() || "";
      text = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
  
      // Prepare email preview per vendor
      const generatedEmails = parseVendors.map((vendor) => ({
        vendorName: vendor.name,
        vendorEmail: vendor.email,
        subject: parsed.subject,
        content: parsed.content,
      }));
      const reply = await Promise.all(
        parseVendors.map(async (vendor) => {
          const prompt = `
            Generate STRICT VALID JSON.
            Create a professional reply message for as a vendor based on the RFP:
      
            Your Name: ${vendor.name}
            your Email: ${vendor.email}
            RFP: ${JSON.stringify(rpf)}
      
            Output only JSON:
            {
              "reply": "professional reply include a counter offer and valid suggestions and things like that"
            }
          `;
      
          const aiResp = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
          });
      
          let text = aiResp?.text?.trim() || "";
          text = text.replace(/```json|```/g, "").trim();
      
          const parsed = JSON.parse(text);
      
          return {
            name: vendor.name,
            email: vendor.email,
            reply: parsed.reply
          };
        })
      );
      
  
      // SAVE TO DB using your Typegoose model
      await EmailBulkModel.create({
        orderName: parsed.orderName,
        Subject: parsed.subject,
        content: parsed.content,
        vendors: parseVendors,
        replies: reply   // initially empty
      });
  
      return res.json({
        message: "Bulk Email Content Generated Successfully",
        emails: generatedEmails,
      });
  
    } catch (error: any) {
      console.error("Bulk Email Error:", error);
      return res.status(500).json({
        error: "AI failed to generate bulk email",
        details: error.message,
      });
    }
  });
  



EmailToVendorRouter.get('/proposals',async(req:Request,res:Response):Promise<any>=>{
    try{
        const records=await EmailModel.find();
        return res.status(200).json({records});
    }
    catch(err)
    {
        return res.status(500).json("Internal Server Error!");
    }

})


EmailToVendorRouter.get('/bulkproposals',async(req:Request,res:Response):Promise<any>=>{
    try{
        const records=await EmailBulkModel.find();
        return res.status(200).json({records});
    }
    catch(err)
    {
        return res.status(500).json("Internal Server Error!");
    }

})



export default EmailToVendorRouter;
