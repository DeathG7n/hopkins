import { NextResponse } from "next/server"
import connectDB from "../../../../../utils/connectMongoDB"
import Drugs from "../../../../../models/drugs"

export async function GET(req){
    connectDB()
    const drugs = await Drugs.find({})
    return NextResponse.json(drugs[0]?.drugs)
}

export async function PUT(req){
    connectDB()
    const body = await req.json()
    const drugs = await Drugs.find({})
    body?.newDrugs.forEach(async(drug) => {
        if (!drugs[0]?.drugs?.includes(drug)){
            await drugs[0].updateOne({$push: {drugs: drug}})
        }
    })
    return NextResponse.json(drugs[0]?.drugs)
}