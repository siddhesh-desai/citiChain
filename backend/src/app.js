import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.router.js";
import bankUserRouter from "./routes/bankuser.route.js";
// routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/bankusers", bankUserRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
