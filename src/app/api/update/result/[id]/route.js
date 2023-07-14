import { NextResponse } from "next/server"
import connectDB from "../../../../../../utils/connectMongoDB"
import Patients from "../../../../../../models/createPatient"

export async function PUT(req,{params}){
    connectDB()
    const body = await req.json()
    const id = params.id
    const user = await Patients.findOne({_id: id})
    const newTests = user?.tests?.map(i => {return i})
    const existingTest = newTests?.find(i => i?.receiptNo == body?.receiptNo)
    
    if(body != {} && body?.requestedTests != undefined){
        if(existingTest){
            const index = newTests.indexOf(existingTest)
            for (let i = 0; i < body?.requestedTests.length; i++) {
                existingTest?.requestedTests.push(body?.requestedTests[i])
            }
            newTests[index] = existingTest
            await user.updateOne({$set: {tests: newTests}})
        }else{
            await user.updateOne({$push: {tests: body}})
        }
    }

    if(body?.printed){
        const newResults = user?.results?.map(i => {return i})
        const existingResult = newResults?.find(i => i?.receiptNo == body?.receiptNo)
        const results = existingResult?.results?.map(i => {return i})
        if(existingResult){
            results[parseInt(body?.result)]["printed"] = true
            const index = newResults?.indexOf(existingResult)
            existingResult?.results.splice(0,existingResult?.results.length, ...results)
            newResults[index] = existingResult
            await user.updateOne({$set: {results: newResults}})
        }
    }

    console.log(parseInt(body?.result))
    
    return NextResponse.json(user)
}