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
    const results = user?.results?.map(i => {return i})
    const userResult = results?.find((i) => i?.receiptNo == body?.receiptNo)
    const userResults = userResult?.results?.map(i => {return i})
    const refResult = userResults?.find((i) => i?.name == body?.result?.name)
    const index = userResults?.indexOf(refResult)
    const resultIndex = results?.indexOf(userResult)
    userResults[index] = body?.result
    userResult?.results?.splice(0, userResults?.length, ...userResults)
    results[resultIndex] = userResult
    
    // const lab = labTest[0].labTests?.filter(i => body?.results.includes(i?.name))
    // const scan = scanTest[0].scanTests?.filter(i => body?.results.includes(i?.name))
    // let parameters = [...lab, ...scan]
    // const refResult = user?.results?.find((i) => i?.receiptNo == body?.receiptNo)
    // let results = refResult?.results?.filter(i => body?.results.includes(i?.name))
    // const userResults = user?.results?.map(i => {return i})
    
    // const date = new Date()
    // const newResult = {
    //     name: body?.name,
    //     abbr: body?.name,
    //     merged: true,
    //     parameters: parameters,
    //     createdAt: date.toDateString(),
    //     results: results
    // }
    // const index = userResults?.indexOf(refResult)
    // refResult?.results?.push(newResult)
    // userResults[index] = refResult
    if(body != null ){
        await user.updateOne({$set: {results: results}})
    }
    console.log(resultIndex)
    return NextResponse.json(user)
}