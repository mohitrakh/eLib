import mongoose from "mongoose";
import { config } from "./config";


async function connectToDB() {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Connected to database successfully")
        })

        mongoose.connection.on("error", () => {
            console.log("Error")
        })
        await mongoose.connect(config.databaseUrl as string);


    } catch (error) {
        console.log("Error: ", error)
        process.exit(1)
    }
}

export default connectToDB