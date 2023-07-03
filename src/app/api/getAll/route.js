import { NextResponse } from "next/server"
import connectDB from "../../../../utils/connectMongoDB"
import Patients from "../../../../models/createPatient"

export async function GET(req){
    connectDB()
    const users = await Patients.find({})
    console.log(users)
    return NextResponse.json(users)
}