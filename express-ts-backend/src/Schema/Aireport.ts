// src/Schema/EmailToVendor.ts
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "AIReport",
    timestamps: true
  }
})
export class AIReport{


    @prop()
    public suggestion!:string;
  
    @prop()
    public alternates!:string;
  
    @prop()
    public summary!: string;

  }
  
  export const AIReportmodel = getModelForClass(AIReport);
  