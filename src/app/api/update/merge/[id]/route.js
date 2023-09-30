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
    let parameters = [...lab, ...scan]
    const refResult = user?.results?.find((i) => i?.receiptNo == body?.receiptNo)
    let results = refResult?.results?.filter(i => body?.results.includes(i?.name))
    const userResults = user?.results?.map(i => {return i})

    refResult?.results?.forEach(result => {
        if(results?.includes(result)){
            result["hide"] = true
        }
    })
    
    const date = new Date()
    const newResult = {
        name: body?.name,
        abbr: body?.name,
        merged: true,
        hide: false,
        parameters: parameters,
        createdAt: date.toDateString(),
        results: results
    }
    const index = userResults?.indexOf(refResult)
    refResult?.results?.push(newResult)
    userResults[index] = refResult
    if(body != null && body?.receiptNo != ""){
        await user.updateOne({$set: {results: userResults}})
    }
    console.log(results)
    return NextResponse.json(user)
}