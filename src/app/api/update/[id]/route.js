import { NextResponse } from "next/server"
import connectDB from "../../../../../utils/connectMongoDB"
import Patients from "../../../../../models/createPatient"

export async function PUT(req,{params}){
    connectDB()
    const body = await req.json()
    const id = params.id
    const user = await Patients.findOne({_id: id})
    const newResults = user?.results?.map(i => {return i})
    const newResult = {
        receiptNo: body?.receiptNo,
        results: [body?.results]
    }
    const existingResult = newResults?.find(i => i?.receiptNo == body?.receiptNo)
    const existing = existingResult?.results?.find(i => i?.name == body?.results?.name)

    if(body != null && !existing ){
        if(!existingResult){
            await user.updateOne({$push: {results: newResult}})
        } else{
            existingResult?.results?.push(body?.results)
            const index = newResults.indexOf(existingResult)
            newResults[index] = existingResult
            await user.updateOne({$set: {results: [...newResults]}})
        }
    }
    
    
    return NextResponse.json(user)
}