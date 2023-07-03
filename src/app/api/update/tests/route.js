import { NextResponse } from "next/server"
import connectDB from "../../../../../utils/connectMongoDB"
import Labtests from "../../../../../models/labTest"
import Scantests from "../../../../../models/scanTest"
import Patients from "../../../../../models/createPatient"
import { labTests, scanTests } from "@/app/create-patient/test"

export async function GET(req){
    connectDB()
    const labTest = await Labtests.find({})
    const scanTest = await Scantests.find({})
    await scanTest[0].updateOne({$set: {scanTests : [...scanTests]}})
    await labTest[0].updateOne({$set: {labTests: [...labTests]}})

    return NextResponse.json(labTest)
}

export async function PUT(req){
    connectDB()
    const body = await req.json()
    const labTest = await Labtests.find({})
    const scanTest = await Scantests.find({})
    const user = await Patients.findOne({receiptNo: body.id})
    await user.updateOne({$push: {requestedTests: body.name}})
    const parameters = body?.parameters?.map(i =>{
        return{
            name: i,
            ref: ""
        }
    })
    const newTest = {
        name: body.name,
        abbr: body.abbr,
        parameters: [...parameters],
        type: body.type,
        categories: "others"
    }

    if(body.type == "scan"){
        await scanTest[0].updateOne({$push: {scanTests: newTest} })
    } else {
        await labTest[0].updateOne({$push: {labTests: newTest} })
    }

    return NextResponse.json(user)
}