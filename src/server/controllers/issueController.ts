import db from "../db.js";

export const getIssues = (req: any, res: any) => {
  let issues;
  if (req.user.role === 'admin') {
    issues = db.prepare("SELECT issues.*, users.name as userName FROM issues JOIN users ON issues.userId = users.id ORDER BY createdAt DESC").all();
  } else {
    issues = db.prepare("SELECT * FROM issues WHERE userId = ? ORDER BY createdAt DESC").all(req.user.id);
  }
  res.json(issues);
};

export const createIssue = (req: any, res: any) => {
  const { title, description, category, location, imagePath } = req.body;
  const result = db.prepare(`
    INSERT INTO issues (userId, title, description, category, location, imagePath)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.user.id, title, description, category, location, imagePath);
  
  // Auto-categorization logic
  let priority = 'medium';
  if (category === 'Water Leakage' || category === 'Road Damage') priority = 'high';
  if (category === 'Streetlight') priority = 'low';
  
  db.prepare("UPDATE issues SET priority = ? WHERE id = ?").run(priority, result.lastInsertRowid);
  
  res.json({ id: result.lastInsertRowid, message: "Issue reported successfully" });
};

export const getNotifications = (req: any, res: any) => {
  const notifications = db.prepare("SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 20").all(req.user.id);
  res.json(notifications);
};
