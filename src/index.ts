import  express  from "express";
import bodyParser from "body-parser";
import router from "./routes/api";

const app = express();

app.use(bodyParser.json());

const PORT = 3000;

app.use("/api", router);

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`)
console.log("thank u guys")
});