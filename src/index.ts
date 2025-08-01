import  express  from "express";
import bodyParser from "body-parser";
import cors from "cors";

import router from "./routes/api";


import db from "../src/utils/database"
import authMiddleware from "./middleware/auth.middleware";
import docs from "./docs/routes";

async function init () {
    try {

        const result = await db();
        console.log("database status", result)
        const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;
const dat = "day"
app.get("/", (req, res) => {
  res.status(200).json({
    message:"Server is running",
    data:null,
  });
});

app.use("/api", router);
docs(app);

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`)
console.log("thank u guys")
});
    } catch (error) {
      console.log(error)  
    }
}

init()
