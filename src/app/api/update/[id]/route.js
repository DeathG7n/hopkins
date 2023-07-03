import { NextResponse } from "next/server"
import connectDB from "../../../../../utils/connectMongoDB"
import Patients from "../../../../../models/createPatient"

export async function PUT(req,{params}){
    connectDB()
    const body = await req.json()
    const id = params.id
    const user = await Patients.findOne({receiptNo: id})
    const existingResult = user?.results?.find(i => i?.name == body?.name)
    console.log(body)
    if(body != {} && !existingResult){
        await user.updateOne({$push: {results: body}})
    }
    
    return NextResponse.json(user)
}