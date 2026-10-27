import express from "express";
import cookieParser from "cookie-parser";
import type { ErrorRequestHandler } from "express";
import { AppError } from "./errors/app-error.js";
import authRouter from './routes/auth.routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.status(200).json({ "status": "ok" })
});

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Server Error" });
};
app.use(handleError);


app.listen(PORT, () => {
  console.log(`NEXORA is running on port ${PORT}`);

})
