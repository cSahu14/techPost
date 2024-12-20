import { config } from "./src/config/config"
import connectionDB from "./src/config/db";
import app from "./src/app";


const port = config.PORT || 5000;

const serverStart = async() => {
    await connectionDB();
    app.listen(port, () => {
        console.log(`Server start at port ${port}`)
    })
}

serverStart();