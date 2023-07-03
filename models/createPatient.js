import { Schema, model, models } from "mongoose";

const patientSchema = new Schema({
    name: String,
    age: Number,
    gender: String,
    requestedTests: Array,
    receiptNo: String,
    results: Array,
    collected: {
        type: Boolean,
        default: false
    },
    labNo: String,
    referral: String,
},{timestamps: true})

const Patients = models.Patients || model("Patients", patientSchema)


export default Patients