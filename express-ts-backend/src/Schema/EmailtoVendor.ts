// src/Schema/EmailToVendor.ts
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    collection: "VendorToEmail",
    timestamps: true
  }
})
export class EmailToVendorSchema {
  @prop()
  public json!: string;

  @prop()
  public vendorName!:string

  @prop({unique:true,required:true})
  public orderName!: string;

  @prop()
  public VendorEmail!: string;

  @prop()
  public Subject!: string;

  @prop()
  public content!: string;

  @prop()
  public replyByVendor!: string;
}

export const EmailModel = getModelForClass(EmailToVendorSchema);
