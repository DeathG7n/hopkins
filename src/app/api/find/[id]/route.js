import { NextResponse } from "next/server"
import connectDB from "../../../../../utils/connectMongoDB"
import Patients from "../../../../../models/createPatient"

export async function GET(req,{params}){
    connectDB()
    const id = params.id
    const user = await Patients.findOne({_id: id})
    return NextResponse.json(user)
}