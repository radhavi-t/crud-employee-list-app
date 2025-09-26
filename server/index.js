import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/userRoute.js";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 8000;
const URL = process.env.MONGOURL;

mongoose.connect(URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{

    console.log("DB connected successfully");

    app.listen(PORT, ()=> {
        console.log(`Server is running on port: ${PORT}`);
    })
}).catch(error => console.log(error));

app.use("/api", route);
app.get('/api/hello', (req, res) => {
  res.json({ msg: 'Hello from backend!' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientBuildPath = path.join(__dirname, "../client/build"); // go up one folder
app.use(express.static(clientBuildPath));

app.get("/ping", (req, res) => {
  console.log("Ping received at", new Date().toISOString()); // optional log
  res.status(200).json({ status: "alive", timestamp: new Date().toISOString() });
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

