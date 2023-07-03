import { NextResponse } from "next/server"
import connectDB from "../../../../../../utils/connectMongoDB"
import Patients from "../../../../../../models/createPatient"

export async function PUT(req,{params}){
    connectDB()
    const id = params.id
    const user = await Patients.findOne({receiptNo: id})
    await user.updateOne({$set: {collected: true}})
    
    return NextResponse.json("ok")
}