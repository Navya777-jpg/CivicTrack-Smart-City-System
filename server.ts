import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import db from "./src/server/db.js";

// Routes
import authRoutes from "./src/server/routes/authRoutes.js";
import issueRoutes from "./src/server/routes/issueRoutes.js";
import adminRoutes from "./src/server/routes/adminRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Seed Admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(
    "admin@civictrack.gov",
    hashedPassword,
    "City Administrator",
    "admin"
  );
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/issues", issueRoutes);
  app.use("/api/admin", adminRoutes);

  // Legacy/Compatibility routes (if any frontend still uses them)
  // The controllers already handle the logic, so we just map them if needed.
  // But we've updated the frontend to use the new routes where applicable.
  // Actually, I'll keep the old /api/stats for compatibility if needed, 
  // but I'll update the frontend to use /api/admin/analytics.
  app.get("/api/stats", (req, res, next) => {
    // Proxy to admin analytics for backward compatibility
    res.redirect(307, "/api/admin/analytics");
  });

  app.get("/api/notifications", (req, res, next) => {
    res.redirect(307, "/api/issues/notifications");
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CivicTrack Server running on http://localhost:${PORT}`);
  });
}

startServer();
