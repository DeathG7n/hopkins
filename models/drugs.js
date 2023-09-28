import { Schema, model, models } from "mongoose";

const drugsSchema = new Schema({
    drugs: Array
})

const Drugs = models.Drugs || model("Drugs", drugsSchema)


export default Drugs