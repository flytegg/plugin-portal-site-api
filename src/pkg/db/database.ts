import mongoose from "mongoose";
import Bun from "bun";

mongoose.connect(Bun.env.MONGODB_URI!!, {
    dbName: Bun.env.DB_NAME!!,
})

export const database = mongoose.connection

database.once("open", () => {
    console.log("[MongoDB]: Successfully connected");
})

database.on("error", (error) => console.error(`[MongoDB] Error: ${error}`))