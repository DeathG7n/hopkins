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
    
    if(body?.result != undefined ){
        const results = user?.results?.map(i => {return i})
        const userResult = results?.find((i) => i?.receiptNo == body?.receiptNo)
        const userResults = userResult?.results?.map(i => {return i})
        const refResult = userResults?.find((i) => i?.name == body?.result?.name)
        const index = userResults?.indexOf(refResult)
        const resultIndex = results?.indexOf(userResult)
        userResults[index] = body?.result
        userResult?.results?.splice(0, userResults?.length, ...userResults)
        results[resultIndex] = userResult
        await user.updateOne({$set: {results: results}})
    } else{
        await user.replaceOne(body)
    }
    return NextResponse.json(user)
}