import app from "./src/app";
import { config } from "./src/config/config";
import connectToDB from "./src/config/db";


const startServer = async () => {
    const port = config.port || 8001
    await connectToDB()
    app.listen(port, () => {
        console.log(`Listening on PORT: ${port}`)
    })

}

startServer()

