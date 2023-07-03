import { Schema, model, models } from "mongoose";

const labTestSchema = new Schema({
    labTests: Array
})

const Labtests = models.Labtests || model("Labtests", labTestSchema)


export default Labtests