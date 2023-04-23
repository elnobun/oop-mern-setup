import "dotenv/config"
import AppModule from "./app.module";

const app = new AppModule([], Number(process.env.PORT))
app.listen()