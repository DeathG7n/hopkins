import { NextResponse } from "next/server"
import connectDB from "../../../../../utils/connectMongoDB"
import Drugs from "../../../../../models/drugs"

export async function GET(req){
    connectDB()
    const drugs = await Drugs.find({})
    // const oldDrugs = ["STREPTOMYCIN(s)", "ERYTHROMYCIN(E)", "MEROPENEM(MEM)", "AMPICILLIN(AMP)", "AGABAXIN(AGX)", "TARIVID(OFX)", "RIFAMPICIN(RD)", "CIPROPLOXACIN(CPX)", "CHLORANPHENICOL(CHL)", "SEPTRIN(SXT)", "GENTAMYCIN(CN)", "PEFLOXACIN(PEF)", "AZITHROMYCIN(AZM)", "AUGMENTIN(AU)", "CEFTAZIDME", "MPLON(CEFPODOXIN)", "CEFIXIME(MIX)"]
    // const createDrug = async(drug)=>{
    //     const newDrug = await new Drugs({
    //         name: drug
    //     })
    //     await newDrug.save()
    // }
    // oldDrugs?.forEach(createDrug)
    return NextResponse.json(drugs)
}

export async function PUT(req){
    connectDB()
    const body = await req.json()
    const drugs = await Drugs.find({})

    if(body.type == "scan"){
        await scanTest[0].updateOne({$push: {scanTests: newTest} })
    } else {
        await labTest[0].updateOne({$push: {labTests: newTest} })
    }

    return NextResponse.json(user)
}