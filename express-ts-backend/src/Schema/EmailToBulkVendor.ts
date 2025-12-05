import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
class VendorItem {
  @prop()
  public name!: string;

  @prop()
  public email!: string;
}
class ReplyItem {
  @prop()
  public name!: string;

  @prop()
  public email!:string

  @prop()
  public reply!: string;
}

@modelOptions({
  schemaOptions: {
    collection: "VendorToBulkEmail",
    timestamps: true
  }
})
export class EmailToBulkVendorSchema {

  @prop({ unique: true, required: true })
  public orderName!: string;

  @prop()
  public Subject!: string;

  @prop()
  public content!: string;


  @prop({ type: () => [VendorItem], default: [] })
  public vendors!: VendorItem[];

  //  ARRAY OF OBJECTS: Reply list
  @prop({ type: () => [ReplyItem], default: [] })
  public replies!: ReplyItem[];
}

export const EmailBulkModel = getModelForClass(EmailToBulkVendorSchema);
