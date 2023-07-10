import { NextResponse } from "next/server"
import connectDB from "../../../../../../utils/connectMongoDB"
import Patients from "../../../../../../models/createPatient"
import Labtests from "../../../../../../models/labTest"
import Scantests from "../../../../../../models/scanTest"

export async function PUT(req,{params}){
    connectDB()
    const body = await req.json()
    const id = params.id
    const user = await Patients.findOne({_id: id})
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
    const newTests = user?.tests?.map(i => {return i})
    const refTest = newTests?.find((i) => i?.receiptNo == body?.receiptNo)
    const index = newTests?.indexOf(refTest)
    const remainingTests = refTest?.requestedTests?.filter((i) => !body?.results.includes(i))
    remainingTests?.push(body?.name)
    refTest?.requestedTests.splice(0, refTest?.requestedTests.length, ...remainingTests)
    newTests[index] = refTest
    
    await labTest[0].updateOne({$push: {labTests: newTest} })
    if(body != null && body?.receiptNo != ""){
        await user.updateOne({$set: {tests: newTests}})
    }
    
    return NextResponse.json(user)
}