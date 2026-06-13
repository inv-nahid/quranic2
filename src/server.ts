import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import quranRoutes from "./modules/quran/quran.routes";
import progressRoutes from "./modules/progress/progress.routes";
import favoriteRoutes from "./modules/favorites/favorites.routes";
import notesRoutes from "./modules/notes/notes.routes";
import hadithRoutes from "./modules/hadith/hadith.routes";
import duaRoutes from "./modules/dua/dua.routes";
import searchRoutes from "./modules/search/search.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import dailyRoutes from "./modules/daily/daily.routes";

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
app.use("/favorites", favoriteRoutes);
app.use("/notes", notesRoutes);
app.use("/hadith", hadithRoutes);
app.use("/duas", duaRoutes);
app.use("/search", searchRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/daily", dailyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
