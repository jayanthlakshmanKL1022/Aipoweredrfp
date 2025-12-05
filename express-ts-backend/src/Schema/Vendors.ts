import { getModelForClass, modelOptions,  prop } from "@typegoose/typegoose";
@modelOptions({schemaOptions: {collection: "vendors",timestamps: true}})

class Vendors{
    @prop({required:true})
    companyname!:string

    @prop({required:true,unique:true})
    email!:string

    @prop({required:true,unique:true})
    contactnumber!:string

    @prop({required:true})
    category!:string

    @prop()
    avgresponsetime!:string

}

export const VendorModel=getModelForClass(Vendors);

