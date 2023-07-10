import { NextResponse } from "next/server"
import connectDB from "../../../../utils/connectMongoDB"
import Patients from "../../../../models/createPatient"

export async function GET(req){
    return NextResponse.json("hi")
}

export async function POST(req){
    connectDB()
    const body = await req.json()
    const tests = {
        receiptNo: body.receiptNo,
        requestedTests: []
    }
    for (let i = 0; i < body.requestedTests.length; i++) {
        tests?.requestedTests.push(body?.requestedTests[i])
    }
    const newPatient = await new Patients({
        name: body.name,
        age: body.age,
        gender: body.gender,
        receiptNo: body.receiptNo,
        tests: [tests],
        labNo: body.labNo,
        referral: body.referral
    })

    if(body?.name != null){
        const user = await newPatient.save()
    } else{
        return
    }

    console.log(newPatient)
    

    return NextResponse.json("Patient Created")
}