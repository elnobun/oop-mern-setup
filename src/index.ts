import "dotenv/config"
import { AppProvider } from "./app.provider";
import AppController from "./modules/controllers/app.controller";

const app = new AppProvider([
    new AppController()
], Number(process.env.PORT))
app.listen()
