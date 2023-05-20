import "dotenv/config"
import AppModule from "./app.module";
import AppController from "./controllers/app.controller";

const app = new AppModule([
    new AppController()
], Number(process.env.PORT))
app.listen()