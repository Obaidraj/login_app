import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");
const port = 8080;
app.get("/", (req, res) => {
  res.status(201).json("Home geT REQUEST");
});
app.use("/api", router);
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`server listening on port ${port}`);
      });
    } catch (error) {
      console.log("can't connect to the server");
    }
  })
  .catch((err) => {
    console.log("Invalid database connection.....!");
  });
