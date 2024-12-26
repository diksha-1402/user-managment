import mongoose from "mongoose";
import constants from "../utils/constants.js";
export default async function connect() {
    const CONNECTION_URL = constants.CONST_DB_URL;
    //mongoose.set('debug', true);
    mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true}).
        then(
            () => {
                console.log("database connected");
            }
        ).catch(
            (error) => {
                console.log("database connection failed, exiting now..", error);
                process.exit(1);
            }
        )
}