import  express  from "express";

const app = express();

const PORT = 3000;

app.use("/api", router);

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`)
});