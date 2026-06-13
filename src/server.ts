import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import quranRoutes from "./modules/quran/quran.routes";
import progressRoutes from "./modules/progress/progress.routes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/quran", quranRoutes);
app.use("/progress", progressRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
