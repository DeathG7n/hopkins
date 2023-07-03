import { NextResponse } from "next/server"
import connectDB from "../../../../../utils/connectMongoDB"
import Labtests from "../../../../../models/labTest"
import Scantests from "../../../../../models/scanTest"

export async function GET(req){
    connectDB()
    const labTest = await Labtests?.find({})
    const scanTest = await Scantests?.find({})
    //await scanTest[0].updateOne({$set: })
    const res = {
        labTests : [...labTest[0]?.labTests],
        scanTests: [...scanTest[0]?.scanTests]
    }
    return NextResponse.json(res)
}