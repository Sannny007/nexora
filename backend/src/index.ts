import express from "express";
import type { ErrorRequestHandler } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.status(200).json({ "status": "ok" })
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" })
};
app.use(handleError);


app.listen(PORT, () => {
  console.log(`NEXORA is running on port ${PORT}`);

})

