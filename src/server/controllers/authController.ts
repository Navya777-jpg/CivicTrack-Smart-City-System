import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "civic-track-secret-key-2026";

export const register = (req: any, res: any) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)").run(email, hashedPassword, name);
    const token = jwt.sign({ id: result.lastInsertRowid, email, name, role: 'citizen' }, JWT_SECRET);
    res.json({ token, user: { id: result.lastInsertRowid, email, name, role: 'citizen' } });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
};

export const login = (req: any, res: any) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
};
