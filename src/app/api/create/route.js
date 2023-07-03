import { NextResponse } from "next/server"
import connectDB from "../../../../utils/connectMongoDB"
import Patients from "../../../../models/createPatient"

export async function GET(req){
    return NextResponse.json("hi")
}

export async function POST(req){
    connectDB()
    const body = await req.json()
    const newPatient = await new Patients({
        name: body.name,
        age: body.age,
        gender: body.gender,
        receiptNo: body.receiptNo,
        requestedTests: [...body.requestedTests],
        labNo: body.labNo,
        referral: body.referral
    })
    const user = await newPatient.save()

    return NextResponse.json("hi")
}