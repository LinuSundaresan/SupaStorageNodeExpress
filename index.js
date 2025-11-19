import express from "express";
import fileRoutes from "./routes/fileRoutes.js";

const app = express();

app.use("/", fileRoutes);

// Start server
app.listen(3003, () => console.log("Server running on port 3003"));
