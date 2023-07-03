import { Schema, model, models } from "mongoose";

const scanTestSchema = new Schema({
    scanTests: Array
})

const Scantests = models.Scantests || model("Scantests", scanTestSchema)


export default Scantests