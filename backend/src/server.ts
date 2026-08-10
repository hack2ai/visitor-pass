import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log("=======================================");
  console.log(" AI Visitor Pass Backend Started");
  console.log("=======================================");
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("=======================================");
});