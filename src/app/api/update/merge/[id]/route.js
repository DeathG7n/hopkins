import { NextResponse } from "next/server"
import connectDB from "../../../../../../utils/connectMongoDB"
import Patients from "../../../../../../models/createPatient"
import Labtests from "../../../../../../models/labTest"
import Scantests from "../../../../../../models/scanTest"

export async function PUT(req,{params}){
    connectDB()
    const body = await req.json()
    const id = params.id
    const user = await Patients.findOne({receiptNo: id})
    const labTest = await Labtests.find({})
    const scanTest = await Scantests.find({})
    const lab = labTest[0].labTests?.filter(i => body?.results.includes(i?.name))
    const scan = scanTest[0].scanTests?.filter(i => body?.results.includes(i?.name))
    let parameters = []
    const labParameters = lab?.map(i => {
        return i?.parameters
    })
    const scanParameters = scan?.map(i => {
        return i?.parameters
    })
    for (let i = 0; i < labParameters.length; i++) {
        parameters?.push(...labParameters[i])
    }
    for (let i = 0; i < scanParameters.length; i++) {
        parameters?.push(...scanParameters[i])
    }
    
    
    const newTest = {
        name: body?.name,
        abbr: body?.name,
        type: "lab",
        parameters: parameters
    }
    const remainingTests = user?.requestedTests?.filter((i) => !body?.results.includes(i))
    
    await labTest[0].updateOne({$push: {labTests: newTest} })
    if(body != {}){
        await user.updateOne({$set: {requestedTests: [...remainingTests, body?.name]}})
    }
    
    return NextResponse.json(user)
}