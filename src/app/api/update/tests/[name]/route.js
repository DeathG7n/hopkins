import { NextResponse } from "next/server"
import connectDB from "../../../../../../utils/connectMongoDB"
import Labtests from "../../../../../../models/labTest"
import Scantests from "../../../../../../models/scanTest"

export async function PUT(req,{params}){
    connectDB()
    const body = await req.json()
    const labTest = await Labtests.find({})
    const scanTest = await Scantests.find({})
    const lab = [...labTest[0]?.labTests]
    const scan = [...scanTest[0]?.scanTests]
    const refTest = lab?.find(i => i?.name == body?.name) || scan?.find(i => i?.name == body?.name)
    const parameters = body?.parameters?.map(i =>{
        return{
            name: i,
            ref: ""
        }
    })
    
    refTest?.parameters.push(...parameters)

    if(lab?.includes(refTest)){
        const index = lab.indexOf(refTest)
        lab[index] = refTest
        await labTest[0].updateOne({$set: {labTests: [...lab]}})
    } else{
        const index = scan.indexOf(refTest)
        scan[index] = refTest
        await scanTest[0].updateOne({$set: {scanTests : [...scan]}})
    }

    return NextResponse.json("ok")
}