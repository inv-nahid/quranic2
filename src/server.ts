import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import quranRoutes from "./modules/quran/quran.routes";
import progressRoutes from "./modules/progress/progress.routes";
import favoriteRoutes from "./modules/favorites/favorites.routes";
import notesRoutes from "./modules/notes/notes.routes";
import hadithRoutes from "./modules/hadith/hadith.routes";

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
