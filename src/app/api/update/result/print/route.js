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
    
    // if(body != {}){
    //     if(existingTest){
    //         const index = newTests.indexOf(existingTest)
    //         for (let i = 0; i < body?.requestedTests.length; i++) {
    //             existingTest?.requestedTests.push(body?.requestedTests[i])
    //         }
    //         newTests[index] = existingTest
    //         await user.updateOne({$set: {tests: newTests}})
    //     }else{
    //         await user.updateOne({$push: {tests: body}})
    //     }
    // }

    console.log(existingTest)
    
    return NextResponse.json(user)
}